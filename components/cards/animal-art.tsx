import * as React from "react";
import type { AnimalType } from "@/lib/cards";

function FoxSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Tail */}
      <path d="M138 138 Q172 132 174 106 Q176 82 158 77 Q146 75 143 87 Q150 102 147 122 Q144 134 138 138Z" fill="#D05A10" stroke="#2C1300" strokeWidth="2.5" strokeLinejoin="round"/>
      <ellipse cx="159" cy="78" rx="10" ry="9" fill="#FFF5E0" stroke="#2C1300" strokeWidth="2"/>
      {/* Body */}
      <ellipse cx="96" cy="128" rx="44" ry="28" fill="#E8671B" stroke="#2C1300" strokeWidth="2.5"/>
      <ellipse cx="96" cy="126" rx="28" ry="20" fill="#FFF5E0"/>
      {/* Paws */}
      <ellipse cx="72" cy="150" rx="16" ry="9" fill="#C85010" stroke="#2C1300" strokeWidth="2"/>
      <ellipse cx="120" cy="150" rx="16" ry="9" fill="#C85010" stroke="#2C1300" strokeWidth="2"/>
      <path d="M65 150 Q72 153 79 150" stroke="#2C1300" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M113 150 Q120 153 127 150" stroke="#2C1300" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Ears */}
      <path d="M64 55 L52 20 Q74 25 80 47Z" fill="#E8671B" stroke="#2C1300" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M65 52 L57 26 Q74 29 77 46Z" fill="#FFF5E0"/>
      <path d="M126 55 L138 20 Q116 25 110 47Z" fill="#E8671B" stroke="#2C1300" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M125 52 L133 26 Q116 29 113 46Z" fill="#FFF5E0"/>
      {/* Head */}
      <circle cx="95" cy="72" r="36" fill="#E8671B" stroke="#2C1300" strokeWidth="2.5"/>
      {/* Muzzle */}
      <ellipse cx="85" cy="87" rx="14" ry="12" fill="#FFF5E0"/>
      <ellipse cx="105" cy="87" rx="14" ry="12" fill="#FFF5E0"/>
      <ellipse cx="95" cy="88" rx="10" ry="11" fill="#FFF5E0"/>
      {/* Eyes */}
      <circle cx="80" cy="68" r="9" fill="#1A0800"/>
      <circle cx="110" cy="68" r="9" fill="#1A0800"/>
      <circle cx="83" cy="65" r="3.5" fill="white"/>
      <circle cx="113" cy="65" r="3.5" fill="white"/>
      <circle cx="81" cy="71" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="111" cy="71" r="1.5" fill="white" opacity="0.5"/>
      {/* Nose */}
      <path d="M91 82 Q95 87 99 82 Q99 77.5 95 76.5 Q91 77.5 91 82Z" fill="#1A0800"/>
      <circle cx="93" cy="79" r="1.5" fill="white" opacity="0.4"/>
      {/* Mouth */}
      <path d="M88 88 Q95 94 102 88" stroke="#1A0800" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function OwlSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Body */}
      <ellipse cx="100" cy="122" rx="42" ry="30" fill="#5B21B6" stroke="#2E1065" strokeWidth="2.5"/>
      {/* Wings */}
      <path d="M60 115 Q30 100 38 140 Q55 148 68 132Z" fill="#4C1D95" stroke="#2E1065" strokeWidth="2"/>
      <path d="M140 115 Q170 100 162 140 Q145 148 132 132Z" fill="#4C1D95" stroke="#2E1065" strokeWidth="2"/>
      {/* Wing detail */}
      <path d="M48 115 Q36 122 42 134" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M152 115 Q164 122 158 134" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Chest fluff */}
      <ellipse cx="100" cy="118" rx="24" ry="18" fill="#DDD6FE"/>
      {/* Head */}
      <circle cx="100" cy="68" r="34" fill="#5B21B6" stroke="#2E1065" strokeWidth="2.5"/>
      {/* Ear tufts */}
      <path d="M82 40 L75 18 Q88 22 90 38Z" fill="#4C1D95" stroke="#2E1065" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M118 40 L125 18 Q112 22 110 38Z" fill="#4C1D95" stroke="#2E1065" strokeWidth="2" strokeLinejoin="round"/>
      {/* Face disc */}
      <ellipse cx="100" cy="72" rx="26" ry="24" fill="#7C3AED" opacity="0.6"/>
      {/* Eyes — large and round (owl key trait) */}
      <circle cx="86" cy="67" r="12" fill="white" stroke="#2E1065" strokeWidth="2"/>
      <circle cx="114" cy="67" r="12" fill="white" stroke="#2E1065" strokeWidth="2"/>
      <circle cx="86" cy="67" r="8" fill="#1A0800"/>
      <circle cx="114" cy="67" r="8" fill="#1A0800"/>
      <circle cx="82" cy="63" r="3" fill="white"/>
      <circle cx="110" cy="63" r="3" fill="white"/>
      <circle cx="84" cy="69" r="1.2" fill="white" opacity="0.5"/>
      <circle cx="112" cy="69" r="1.2" fill="white" opacity="0.5"/>
      {/* Beak */}
      <path d="M97 75 L100 82 L103 75 Q100 73 97 75Z" fill="#F59E0B"/>
      {/* Brow marks */}
      <path d="M77 57 Q86 53 94 57" stroke="#2E1065" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M106 57 Q114 53 123 57" stroke="#2E1065" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function BearSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Body */}
      <ellipse cx="100" cy="122" rx="46" ry="30" fill="#92400E" stroke="#451A03" strokeWidth="2.5"/>
      {/* Belly */}
      <ellipse cx="100" cy="118" rx="28" ry="20" fill="#D97706"/>
      {/* Paws at bottom */}
      <ellipse cx="72" cy="148" rx="16" ry="10" fill="#78350F" stroke="#451A03" strokeWidth="2"/>
      <ellipse cx="128" cy="148" rx="16" ry="10" fill="#78350F" stroke="#451A03" strokeWidth="2"/>
      <path d="M66 148 Q72 152 78 148" stroke="#451A03" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M122 148 Q128 152 134 148" stroke="#451A03" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Ears */}
      <circle cx="72" cy="40" r="18" fill="#92400E" stroke="#451A03" strokeWidth="2.5"/>
      <circle cx="128" cy="40" r="18" fill="#92400E" stroke="#451A03" strokeWidth="2.5"/>
      <circle cx="72" cy="40" r="11" fill="#78350F"/>
      <circle cx="128" cy="40" r="11" fill="#78350F"/>
      {/* Head */}
      <circle cx="100" cy="72" r="36" fill="#92400E" stroke="#451A03" strokeWidth="2.5"/>
      {/* Muzzle */}
      <ellipse cx="100" cy="84" rx="22" ry="16" fill="#D97706" stroke="#451A03" strokeWidth="1.5"/>
      {/* Eyes */}
      <circle cx="84" cy="65" r="8" fill="#1A0800"/>
      <circle cx="116" cy="65" r="8" fill="#1A0800"/>
      <circle cx="87" cy="62" r="3" fill="white"/>
      <circle cx="119" cy="62" r="3" fill="white"/>
      <circle cx="85" cy="68" r="1.3" fill="white" opacity="0.5"/>
      <circle cx="117" cy="68" r="1.3" fill="white" opacity="0.5"/>
      {/* Nose */}
      <ellipse cx="100" cy="80" rx="7" ry="5" fill="#1A0800"/>
      <circle cx="97.5" cy="78.5" r="1.5" fill="white" opacity="0.4"/>
      {/* Mouth */}
      <path d="M97 85 Q100 89 103 85" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M100 85 Q100 90 100 89" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function RabbitSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Long ears — key rabbit identifier */}
      <path d="M78 64 Q68 10 76 4 Q88 0 90 64Z" fill="#D97706" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M79 62 Q72 14 78 9 Q87 7 88 62Z" fill="#FEF3C7"/>
      <path d="M122 64 Q132 10 124 4 Q112 0 110 64Z" fill="#D97706" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M121 62 Q128 14 122 9 Q113 7 112 62Z" fill="#FEF3C7"/>
      {/* Body */}
      <ellipse cx="100" cy="122" rx="38" ry="28" fill="#D97706" stroke="#78350F" strokeWidth="2.5"/>
      {/* Belly */}
      <ellipse cx="100" cy="120" rx="24" ry="19" fill="#FEF3C7"/>
      {/* Feet */}
      <ellipse cx="74" cy="148" rx="20" ry="10" fill="#B45309" stroke="#78350F" strokeWidth="2"/>
      <ellipse cx="126" cy="148" rx="20" ry="10" fill="#B45309" stroke="#78350F" strokeWidth="2"/>
      {/* Head */}
      <circle cx="100" cy="74" r="30" fill="#D97706" stroke="#78350F" strokeWidth="2.5"/>
      {/* Cheeks */}
      <circle cx="82" cy="84" r="9" fill="#FCA5A5" opacity="0.6"/>
      <circle cx="118" cy="84" r="9" fill="#FCA5A5" opacity="0.6"/>
      {/* Eyes */}
      <circle cx="87" cy="70" r="8" fill="#1A0800"/>
      <circle cx="113" cy="70" r="8" fill="#1A0800"/>
      <circle cx="90" cy="67" r="3" fill="white"/>
      <circle cx="116" cy="67" r="3" fill="white"/>
      {/* Nose */}
      <ellipse cx="100" cy="80" rx="4" ry="3" fill="#EC4899"/>
      {/* Mouth */}
      <path d="M97 83 Q100 87 103 83" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M100 83 L100 80" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function RaccoonSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Striped tail */}
      <path d="M134 132 Q165 126 168 105 Q171 84 158 80 Q147 78 144 90 Q150 104 147 120 Q144 130 134 132Z" fill="#6B7280" stroke="#1F2937" strokeWidth="2"/>
      <path d="M148 82 Q158 84 160 94 Q156 84 148 82Z" fill="#1F2937" opacity="0.5"/>
      <path d="M145 96 Q153 97 154 107 Q150 97 145 96Z" fill="#1F2937" opacity="0.5"/>
      <path d="M143 112 Q150 114 150 122 Q147 113 143 112Z" fill="#1F2937" opacity="0.5"/>
      {/* Body */}
      <ellipse cx="95" cy="122" rx="42" ry="28" fill="#9CA3AF" stroke="#1F2937" strokeWidth="2.5"/>
      <ellipse cx="95" cy="120" rx="26" ry="19" fill="#E5E7EB"/>
      {/* Feet */}
      <ellipse cx="72" cy="147" rx="15" ry="9" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
      <ellipse cx="118" cy="147" rx="15" ry="9" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
      {/* Ears */}
      <path d="M66 50 L58 24 Q78 28 82 46Z" fill="#6B7280" stroke="#1F2937" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M67 47 L62 28 Q77 31 79 45Z" fill="#1F2937"/>
      <path d="M124 50 L132 24 Q112 28 108 46Z" fill="#6B7280" stroke="#1F2937" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M123 47 L128 28 Q113 31 111 45Z" fill="#1F2937"/>
      {/* Head */}
      <circle cx="95" cy="70" r="34" fill="#9CA3AF" stroke="#1F2937" strokeWidth="2.5"/>
      {/* Mask — raccoon's defining feature */}
      <path d="M64 62 Q72 54 84 58 Q90 56 90 66 Q84 72 76 70 Q68 72 64 62Z" fill="#1F2937"/>
      <path d="M126 62 Q118 54 106 58 Q100 56 100 66 Q106 72 114 70 Q122 72 126 62Z" fill="#1F2937"/>
      {/* Eyes inside mask */}
      <circle cx="80" cy="63" r="7" fill="white"/>
      <circle cx="110" cy="63" r="7" fill="white"/>
      <circle cx="80" cy="63" r="4.5" fill="#1A0800"/>
      <circle cx="110" cy="63" r="4.5" fill="#1A0800"/>
      <circle cx="81.5" cy="61" r="1.8" fill="white"/>
      <circle cx="111.5" cy="61" r="1.8" fill="white"/>
      {/* Muzzle */}
      <ellipse cx="95" cy="80" rx="18" ry="13" fill="#E5E7EB"/>
      {/* Nose */}
      <ellipse cx="95" cy="77" rx="5" ry="4" fill="#1A0800"/>
      {/* Mouth */}
      <path d="M91 82 Q95 87 99 82" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function WolfSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Body */}
      <ellipse cx="100" cy="122" rx="44" ry="28" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2.5"/>
      {/* Chest fur (white) */}
      <path d="M78 102 Q100 96 122 102 Q115 128 100 130 Q85 128 78 102Z" fill="#EFF6FF"/>
      {/* Feet */}
      <ellipse cx="74" cy="148" rx="16" ry="9" fill="#1E3A8A" stroke="#1E3A8A" strokeWidth="2"/>
      <ellipse cx="126" cy="148" rx="16" ry="9" fill="#1E3A8A" stroke="#1E3A8A" strokeWidth="2"/>
      {/* Pointed ears */}
      <path d="M64 52 L52 16 Q76 22 80 46Z" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M65 49 L57 20 Q74 25 77 45Z" fill="#60A5FA" opacity="0.6"/>
      <path d="M136 52 L148 16 Q124 22 120 46Z" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M135 49 L143 20 Q126 25 123 45Z" fill="#60A5FA" opacity="0.6"/>
      {/* Head — slightly elongated (wolf snout) */}
      <ellipse cx="100" cy="68" rx="34" ry="32" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2.5"/>
      {/* Snout — elongated forward */}
      <path d="M76 80 Q100 96 124 80 Q120 72 100 70 Q80 72 76 80Z" fill="#3B82F6"/>
      {/* Eyes — intense, slightly slanted */}
      <ellipse cx="82" cy="62" rx="9" ry="8" fill="#FEF9C3"/>
      <ellipse cx="118" cy="62" rx="9" ry="8" fill="#FEF9C3"/>
      <circle cx="83" cy="63" r="6" fill="#1A0800"/>
      <circle cx="119" cy="63" r="6" fill="#1A0800"/>
      <circle cx="84.5" cy="61" r="2.2" fill="white"/>
      <circle cx="120.5" cy="61" r="2.2" fill="white"/>
      {/* Nose */}
      <ellipse cx="100" cy="79" rx="6" ry="4.5" fill="#1A0800"/>
      <circle cx="98" cy="77.5" r="1.5" fill="white" opacity="0.4"/>
      {/* Mouth */}
      <path d="M93 84 Q100 90 107 84" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Whisker marks */}
      <path d="M80 80 L62 76" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <path d="M80 83 L62 83" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <path d="M120 80 L138 76" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <path d="M120 83 L138 83" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

function DeerSvg() {
  return (
    <svg viewBox="0 0 200 155" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Antlers — deer's key trait */}
      <path d="M80 50 L72 28 L64 14 M72 28 L60 22 M72 28 L68 16" stroke="#065F46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M120 50 L128 28 L136 14 M128 28 L140 22 M128 28 L132 16" stroke="#065F46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Ears */}
      <ellipse cx="70" cy="56" rx="14" ry="10" fill="#059669" stroke="#065F46" strokeWidth="2" transform="rotate(-20 70 56)"/>
      <ellipse cx="70" cy="56" rx="9" ry="6" fill="#D1FAE5" transform="rotate(-20 70 56)"/>
      <ellipse cx="130" cy="56" rx="14" ry="10" fill="#059669" stroke="#065F46" strokeWidth="2" transform="rotate(20 130 56)"/>
      <ellipse cx="130" cy="56" rx="9" ry="6" fill="#D1FAE5" transform="rotate(20 130 56)"/>
      {/* Body */}
      <ellipse cx="100" cy="122" rx="40" ry="27" fill="#059669" stroke="#065F46" strokeWidth="2.5"/>
      {/* White spots on back */}
      <circle cx="88" cy="112" r="5" fill="#D1FAE5" opacity="0.7"/>
      <circle cx="104" cy="106" r="4" fill="#D1FAE5" opacity="0.7"/>
      <circle cx="116" cy="116" r="5" fill="#D1FAE5" opacity="0.7"/>
      {/* Belly */}
      <ellipse cx="100" cy="120" rx="22" ry="16" fill="#D1FAE5"/>
      {/* Legs */}
      <ellipse cx="76" cy="148" rx="12" ry="8" fill="#047857" stroke="#065F46" strokeWidth="2"/>
      <ellipse cx="124" cy="148" rx="12" ry="8" fill="#047857" stroke="#065F46" strokeWidth="2"/>
      {/* Head */}
      <ellipse cx="100" cy="70" rx="28" ry="30" fill="#059669" stroke="#065F46" strokeWidth="2.5"/>
      {/* White muzzle */}
      <ellipse cx="100" cy="84" rx="16" ry="11" fill="#D1FAE5"/>
      {/* Eyes — big and gentle */}
      <circle cx="86" cy="65" r="9" fill="#1A0800"/>
      <circle cx="114" cy="65" r="9" fill="#1A0800"/>
      <circle cx="83" cy="62" r="3.5" fill="white"/>
      <circle cx="111" cy="62" r="3.5" fill="white"/>
      <circle cx="84.5" cy="68" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="112.5" cy="68" r="1.5" fill="white" opacity="0.5"/>
      {/* Nose */}
      <ellipse cx="100" cy="81" rx="5" ry="4" fill="#065F46"/>
      {/* Mouth */}
      <path d="M96 85 Q100 89 104 85" stroke="#065F46" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

const ART_MAP: Record<AnimalType, () => JSX.Element> = {
  fox:     FoxSvg,
  owl:     OwlSvg,
  bear:    BearSvg,
  rabbit:  RabbitSvg,
  raccoon: RaccoonSvg,
  wolf:    WolfSvg,
  deer:    DeerSvg,
};

export function AnimalArt({ animal }: { animal: AnimalType }) {
  const Component = ART_MAP[animal];
  return <Component />;
}
