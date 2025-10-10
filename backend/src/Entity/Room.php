<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\RoomRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Reservation;

#[ORM\Entity(repositoryClass: RoomRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get()
    ],
    normalizationContext: ['groups' => ['room:read']],
    denormalizationContext: ['groups' => ['room:write']]
)]
class Room
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['room:read','reservation:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['room:read','room:write','reservation:read'])]
    private ?string $name = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['room:read','room:write','reservation:read'])]
    private int $price = 0; // price per night in EUR

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['room:read','room:write'])]
    private ?string $description = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['room:read','room:write'])]
    private ?array $photos = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['room:read','room:write'])]
    private ?array $equipments = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['room:read','room:write'])]
    private int $capacity = 2;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['room:read','room:write'])]
    private ?string $slug = null;

    #[ORM\OneToMany(mappedBy: 'room', targetEntity: Reservation::class, cascade: ['remove'])]
    private Collection $reservations;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
    }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getPrice(): int { return $this->price; }
    public function setPrice(int $price): self { $this->price = $price; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }

    public function getPhotos(): ?array { return $this->photos; }
    public function setPhotos(?array $photos): self { $this->photos = $photos; return $this; }

    public function getEquipments(): ?array { return $this->equipments; }
    public function setEquipments(?array $equipments): self { $this->equipments = $equipments; return $this; }

    public function getCapacity(): int { return $this->capacity; }
    public function setCapacity(int $capacity): self { $this->capacity = $capacity; return $this; }

    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(string $slug): self { $this->slug = $slug; return $this; }

    /** @return Collection<int, Reservation> */
    public function getReservations(): Collection { return $this->reservations; }
}
