"use client";

import { useState } from "react";
import { AnimalCard } from "./animal-card";
import {
  // export function CardCollection() {
  //   const [filterRarity, setFilterRarity] = useState<CardRarity | "all">("all");
  //   const [filterAnimal, setFilterAnimal] = useState<AnimalType | "all">("all");
  //
  //   const visible = ALL_CARDS.filter((c) => {
  //     if (filterRarity !== "all" && c.rarity !== filterRarity) return false;
  //     if (filterAnimal !== "all" && c.animal !== filterAnimal) return false;
  //     return true;
  //   });
  //
  //   return (
  //     <div className="space-y-6">
  //       {/* ...Card collection UI... */}
  //     </div>
  //   );
  // }
          );
        })}
      </div>

      <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
        Showing {visible.length} card{visible.length !== 1 ? "s" : ""}
      </p>

      {visible.length === 0 ? (
        <div className="py-16 text-center text-sm text-[var(--color-text-secondary)]">
          No cards match that filter.
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {visible.map((card) => (
            <AnimalCard
              key={card.id}
              card={card}
              size="md"
              imageSrc={`/mascot/${card.animal}.png`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
