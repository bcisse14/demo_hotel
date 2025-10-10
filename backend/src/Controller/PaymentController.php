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
    #[Route('/payments/intent', name: 'payment_intent', methods: ['POST'])]
    public function intent(Request $request, EntityManagerInterface $em, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        // Simulate a payment success and mark reservation as confirmed with partial amount
        $reservationId = $data['reservation_id'] ?? null;
        if (!$reservationId) {
            return new JsonResponse(['error' => 'reservation_id required'], 400);
        }
        $reservation = $em->getRepository(Reservation::class)->find($reservationId);
        if (!$reservation) {
            return new JsonResponse(['error' => 'reservation not found'], 404);
        }
        $reservation->setStatus('confirmed');
        $reservation->setAmountPaid($data['amount'] ?? 0);
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

        return new JsonResponse(['status' => 'succeeded']);
    }
}
