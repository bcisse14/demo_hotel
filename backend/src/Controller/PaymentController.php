<?php

namespace App\Controller;

use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Attribute\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class PaymentController extends AbstractController
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
    public function intent(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Demo mode: always succeed. If reservation exists, mark it confirmed.
        $data = json_decode($request->getContent(), true) ?? [];
        $reservationId = $data['reservation_id'] ?? null;
        if ($reservationId) {
            $reservation = $em->getRepository(Reservation::class)->find($reservationId);
            if ($reservation) {
                $reservation->setStatus('confirmed');
                $reservation->setAmountPaid((int)($data['amount'] ?? 0));
                try { $em->flush(); } catch (\Throwable $t) { /* ignore persistence errors in demo */ }
            }
        }

        return new JsonResponse(['status' => 'succeeded'], 200, [
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}
