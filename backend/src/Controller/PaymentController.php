<?php

namespace App\Controller;

use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Attribute\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Attribute\AsController;

#[AsController]
class PaymentController
{
    #[Route('/payments/intent', name: 'payment_intent_options', methods: ['OPTIONS'])]
    public function options(): JsonResponse
    {
        // CORS preflight response for cross-origin POST from the frontend (Vercel)
        return new JsonResponse(null, 204, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Accept',
        ]);
    }

    #[Route('/payments/intent', name: 'payment_intent', methods: ['POST'])]
    public function intent(Request $request, EntityManagerInterface $em, MailerInterface $mailer): JsonResponse
    {
        // TEMP: early return to validate controller reachability in production
        if ($request->query->get('ping') === '1') {
            return new JsonResponse(['ping' => 'ok'], 200, [
                'Access-Control-Allow-Origin' => '*',
            ]);
        }
        try {
            $data = json_decode($request->getContent(), true) ?? [];
            // Simulate a payment success and mark reservation as confirmed with partial amount
            $reservationId = $data['reservation_id'] ?? null;
            if (!$reservationId) {
                return new JsonResponse(['error' => 'reservation_id required'], 400, [
                    'Access-Control-Allow-Origin' => '*',
                ]);
            }
            $reservation = $em->getRepository(Reservation::class)->find($reservationId);
            if (!$reservation) {
                return new JsonResponse(['error' => 'reservation not found'], 404, [
                    'Access-Control-Allow-Origin' => '*',
                ]);
            }
            $reservation->setStatus('confirmed');
            $reservation->setAmountPaid((int)($data['amount'] ?? 0));
            $em->flush();

            // Send simulated confirmation email
            $startTxt = $reservation->getStartDate() ? $reservation->getStartDate()->format('d/m/Y') : '';
            $endTxt = $reservation->getEndDate() ? $reservation->getEndDate()->format('d/m/Y') : '';
            $email = (new Email())
                ->from('no-reply@demo-hotel.local')
                ->to($reservation->getEmail())
                ->subject('Confirmation de réservation')
                ->text(sprintf('Bonjour %s, votre réservation est confirmée du %s au %s.',
                    $reservation->getName(), $startTxt, $endTxt));
            try {
                $mailer->send($email);
            } catch (\Throwable $e) {
                // swallow email errors in sandbox
            }

            return new JsonResponse(['status' => 'succeeded'], 200, [
                'Access-Control-Allow-Origin' => '*',
            ]);
        } catch (\Throwable $e) {
            return new JsonResponse([
                'error' => 'payment_failed',
                'message' => $e->getMessage(),
            ], 500, [
                'Access-Control-Allow-Origin' => '*',
            ]);
        }
    }
}
