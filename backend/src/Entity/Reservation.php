<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\ReservationRepository;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ApiResource(
    operations: [
        new Post(),
        new Get(),
        new GetCollection()
    ],
    normalizationContext: ['groups' => ['reservation:read']],
    denormalizationContext: ['groups' => ['reservation:write']]
)]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['reservation:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[Groups(['reservation:read','reservation:write'])]
    private ?Room $room = null;

    #[ORM\Column(length: 255)]
    #[Groups(['reservation:read','reservation:write'])]
    private string $name;

    #[ORM\Column(length: 255)]
    #[Groups(['reservation:read','reservation:write'])]
    private string $email;

    #[ORM\Column(type: 'date_immutable')]
    #[Groups(['reservation:read','reservation:write'])]
    private \DateTimeImmutable $startDate;

    #[ORM\Column(type: 'date_immutable')]
    #[Groups(['reservation:read','reservation:write'])]
    private \DateTimeImmutable $endDate;

    #[ORM\Column(type: 'integer')]
    #[Groups(['reservation:read','reservation:write'])]
    private int $guests = 1;

    #[ORM\Column(length: 20)]
    #[Groups(['reservation:read'])]
    private string $status = 'pending';

    #[ORM\Column(type: 'integer')]
    #[Groups(['reservation:read'])]
    private int $amountPaid = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRoom(): ?Room { return $this->room; }
    public function setRoom(?Room $room): self { $this->room = $room; return $this; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }

    public function getStartDate(): \DateTimeImmutable { return $this->startDate; }
    public function setStartDate(\DateTimeImmutable $startDate): self { $this->startDate = $startDate; return $this; }

    public function getEndDate(): \DateTimeImmutable { return $this->endDate; }
    public function setEndDate(\DateTimeImmutable $endDate): self { $this->endDate = $endDate; return $this; }

    public function getGuests(): int { return $this->guests; }
    public function setGuests(int $guests): self { $this->guests = $guests; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }

    public function getAmountPaid(): int { return $this->amountPaid; }
    public function setAmountPaid(int $amountPaid): self { $this->amountPaid = $amountPaid; return $this; }
}
