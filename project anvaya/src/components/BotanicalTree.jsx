import React from 'react';

/**
 * Botanical Leaf Cluster Component
 * Renders a vibrant, organic spray of botanical leaves with lush forest-green washes,
 * crisp botanical contours, and delicate warm ivory inner veins.
 */
function LeafSpray({ 
  x, 
  y, 
  rotation = 0, 
  scale = 1, 
  windClass = "leaf-wind-1",
  leafTone = "#2D633E",      // Vibrant botanical forest emerald
  accentTone = "#3E7B50",    // Lush botanical moss
  highlightTone = "#529064"  // Luminous fresh leaf green
}) {
  return (
    <g 
      className={windClass}
      style={{
        transformOrigin: `${x}px ${y}px`,
        willChange: 'transform'
      }}
    >
      <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
        {/* Slender Branchlet */}
        <path d="M0 0 C8 -12 18 -26 28 -38" stroke="#4B3324" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        
        {/* Leaf 1 (Left Lower) */}
        <path 
          d="M7 -12 C-3 -21 -7 -33 1 -40 C11 -33 12 -18 7 -12 Z" 
          fill={leafTone} 
          fillOpacity="0.35" 
          stroke="#1A3823" 
          strokeWidth="0.65" 
          strokeLinejoin="round"
        />
        <path d="M7 -12 C3 -23 2 -32 1 -40" stroke="#F5EEDB" strokeWidth="0.45" fill="none" opacity="0.45" strokeLinecap="round" />

        {/* Leaf 2 (Right Lower) */}
        <path 
          d="M12 -16 C20 -24 32 -25 35 -17 C29 -8 18 -8 12 -16 Z" 
          fill={accentTone} 
          fillOpacity="0.32" 
          stroke="#1A3823" 
          strokeWidth="0.65" 
          strokeLinejoin="round"
        />
        <path d="M12 -16 C21 -18 28 -20 35 -17" stroke="#F5EEDB" strokeWidth="0.45" fill="none" opacity="0.45" strokeLinecap="round" />

        {/* Leaf 3 (Left Mid) */}
        <path 
          d="M16 -25 C8 -35 7 -46 17 -52 C25 -43 23 -32 16 -25 Z" 
          fill={highlightTone} 
          fillOpacity="0.35" 
          stroke="#1A3823" 
          strokeWidth="0.65" 
          strokeLinejoin="round"
        />
        <path d="M16 -25 C13 -34 14 -44 17 -52" stroke="#F5EEDB" strokeWidth="0.45" fill="none" opacity="0.45" strokeLinecap="round" />

        {/* Leaf 4 (Right Mid) */}
        <path 
          d="M22 -31 C33 -36 43 -34 45 -25 C37 -18 27 -21 22 -31 Z" 
          fill={accentTone} 
          fillOpacity="0.32" 
          stroke="#1A3823" 
          strokeWidth="0.65" 
          strokeLinejoin="round"
        />
        <path d="M22 -31 C31 -32 39 -30 45 -25" stroke="#F5EEDB" strokeWidth="0.45" fill="none" opacity="0.45" strokeLinecap="round" />

        {/* Leaf 5 (Terminal Apex) */}
        <path 
          d="M28 -38 C26 -50 32 -62 40 -64 C44 -53 38 -43 28 -38 Z" 
          fill={leafTone} 
          fillOpacity="0.4" 
          stroke="#1A3823" 
          strokeWidth="0.7" 
          strokeLinejoin="round"
        />
        <path d="M28 -38 C31 -47 35 -56 40 -64" stroke="#F5EEDB" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

/**
 * Vibrant Botanical Tree Illustration
 * 
 * - Rich, defined central trunk with warm woodgrain contours and deep walnut bark tones.
 * - Naturally branching limbs, secondary branches, and lush leaf clusters with vibrant botanical greens.
 * - Symmetrically centered lower trunk (X = 584 - 616, centered at X = 600) descending into the footer
 *   for 100% seamless, sub-pixel alignment with the footer root system.
 * - Gentle left-to-right breeze animation traversing the foliage.
 */
export default function BotanicalTree() {
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden flex justify-center"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full max-w-7xl mx-auto opacity-[0.07] transition-opacity duration-700"
        viewBox="0 0 1200 2400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* =========================================================================
            1. TRUNK & BRANCHING SYSTEM (Rich Walnut & Espresso Bark Tones)
           ========================================================================= */}
        <g strokeLinecap="round" strokeLinejoin="round">
          
          {/* Main Trunk Lower Section (Y: 1750 to 2400)
              Runs vertically straight centered along X = 600 (Left: 584, Right: 616).
              This guarantees that wherever the footer begins on any screen, the trunk
              enters the footer at the exact center (50%) matching the roots in Footer.jsx! */}
          <path 
            d="M584 2400 L584 1750" 
            stroke="#3D2719" 
            strokeWidth="5.5" 
          />
          <path 
            d="M616 2400 L616 1750" 
            stroke="#3D2719" 
            strokeWidth="4.2" 
          />
          <path 
            d="M594 2400 L594 1750" 
            stroke="#5E3D2A" 
            strokeWidth="2.0" 
            strokeDasharray="45 12 25 12" 
          />
          <path 
            d="M606 2400 L606 1750" 
            stroke="#755038" 
            strokeWidth="1.8" 
            strokeDasharray="35 10 18 10" 
          />

          {/* Main Trunk Middle & Upper Section (Y: 780 to 1750)
              Gracefully transitions from the vertical base into organic natural curves */}
          <path 
            d="M584 1750 
               C584 1600 550 1440 520 1280 
               C490 1120 480 950 495 780" 
            stroke="#3D2719" 
            strokeWidth="5.5" 
          />
          <path 
            d="M616 1750 
               C616 1600 580 1440 545 1280 
               C515 1120 505 950 518 780" 
            stroke="#4A2E1C" 
            strokeWidth="4.0" 
          />
          <path 
            d="M594 1750 
               C594 1600 562 1440 530 1280 
               C500 1120 492 950 506 790" 
            stroke="#5E3D2A" 
            strokeWidth="2.0" 
            strokeDasharray="40 10 20 10" 
          />
          <path 
            d="M606 1750 
               C606 1600 572 1440 538 1280 
               C508 1120 498 950 512 790" 
            stroke="#755038" 
            strokeWidth="1.6" 
            strokeDasharray="30 8 15 8" 
          />


          {/* --- Lower Tier Limbs (Y: 1500 - 1850) --- */}
          {/* Left Lower Bough */}
          <path d="M584 1780 C500 1740 410 1695 320 1650 C230 1605 145 1555 60 1495" stroke="#3D2719" strokeWidth="3.6" />
          <path d="M410 1695 C350 1625 285 1565 210 1510" stroke="#4D3222" strokeWidth="2.4" />
          <path d="M320 1650 C260 1575 190 1510 110 1450" stroke="#5E3D2A" strokeWidth="1.8" />
          <path d="M230 1605 C180 1535 125 1465 65 1400" stroke="#6E4A34" strokeWidth="1.4" />
          <path d="M145 1555 C105 1485 70 1415 30 1345" stroke="#6E4A34" strokeWidth="1.2" />

          {/* Right Lower Bough */}
          <path d="M616 1760 C700 1720 790 1675 880 1630 C970 1585 1055 1530 1140 1460" stroke="#3D2719" strokeWidth="3.6" />
          <path d="M790 1675 C850 1605 915 1545 990 1485" stroke="#4D3222" strokeWidth="2.4" />
          <path d="M880 1630 C945 1555 1015 1485 1090 1420" stroke="#5E3D2A" strokeWidth="1.8" />
          <path d="M970 1585 C1025 1515 1075 1445 1130 1375" stroke="#6E4A34" strokeWidth="1.4" />
          <path d="M1055 1530 C1100 1460 1140 1385 1175 1315" stroke="#6E4A34" strokeWidth="1.2" />


          {/* --- Mid Tier Limbs (Y: 950 - 1450) --- */}
          {/* Left Mid Bough */}
          <path d="M520 1280 C430 1215 330 1150 225 1075 C135 1000 65 920 15 820" stroke="#3D2719" strokeWidth="3.8" />
          <path d="M330 1150 C265 1070 190 995 110 925" stroke="#4D3222" strokeWidth="2.4" />
          <path d="M225 1075 C175 985 115 905 55 825" stroke="#5E3D2A" strokeWidth="1.8" />
          <path d="M430 1215 C370 1130 295 1055 205 985" stroke="#5E3D2A" strokeWidth="2.0" />
          <path d="M190 995 C145 915 95 840 45 760" stroke="#6E4A34" strokeWidth="1.4" />

          {/* Right Mid Bough */}
          <path d="M545 1280 C645 1210 755 1145 870 1070 C975 995 1065 910 1140 805" stroke="#3D2719" strokeWidth="3.8" />
          <path d="M755 1145 C835 1065 925 985 1005 895" stroke="#4D3222" strokeWidth="2.4" />
          <path d="M870 1070 C950 980 1025 890 1095 800" stroke="#5E3D2A" strokeWidth="1.8" />
          <path d="M645 1210 C715 1120 795 1045 885 965" stroke="#5E3D2A" strokeWidth="2.0" />
          <path d="M925 985 C990 900 1050 815 1105 725" stroke="#6E4A34" strokeWidth="1.4" />


          {/* --- Upper Canopy Limbs (Y: 50 - 950) --- */}
          {/* Main Fork Left */}
          <path d="M495 780 C445 640 375 510 285 380 C195 250 110 140 25 35" stroke="#3D2719" strokeWidth="4.0" />
          <path d="M375 510 C305 395 215 285 125 185 C65 115 25 55 5 10" stroke="#4D3222" strokeWidth="2.6" />
          <path d="M285 380 C230 280 160 180 85 95" stroke="#5E3D2A" strokeWidth="2.0" />
          <path d="M195 250 C150 160 95 85 40 20" stroke="#6E4A34" strokeWidth="1.5" />
          <path d="M445 640 C395 520 330 420 250 320" stroke="#5E3D2A" strokeWidth="2.2" />

          {/* Main Fork Right */}
          <path d="M518 780 C588 640 688 510 798 395 C918 275 1038 170 1158 60" stroke="#3D2719" strokeWidth="4.0" />
          <path d="M688 510 C778 390 878 280 988 180 C1068 105 1138 50 1195 5" stroke="#4D3222" strokeWidth="2.6" />
          <path d="M798 395 C878 285 968 185 1058 95" stroke="#5E3D2A" strokeWidth="2.0" />
          <path d="M918 275 C988 175 1063 95 1133 25" stroke="#6E4A34" strokeWidth="1.5" />
          <path d="M588 640 C658 520 743 415 843 320" stroke="#5E3D2A" strokeWidth="2.2" />

          {/* Central Crown Taper */}
          <path d="M506 780 C522 630 530 480 520 340 C508 220 484 110 445 10" stroke="#3D2719" strokeWidth="3.0" />
          <path d="M520 480 C568 370 604 260 618 140" stroke="#4D3222" strokeWidth="2.0" />
          <path d="M522 630 C482 510 436 410 380 320" stroke="#5E3D2A" strokeWidth="1.8" />
        </g>


        {/* =========================================================================
            2. VIBRANT BOTANICAL LEAF CLUSTERS (Lush Forest Emerald & Moss Tones)
            Animated with gentle wind wave travelling Left -> Right:
            Group 1 (Far Left) -> Group 2 (Mid Left) -> Group 3 (Center) -> Group 4 (Mid Right) -> Group 5 (Far Right)
           ========================================================================= */}
        
        {/* === GROUP 1: FAR-LEFT CANOPY & MARGINS (Starts Wind Wave) === */}
        <LeafSpray x={35} y={75} rotation={-50} scale={1.3} windClass="leaf-wind-1" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={75} y={150} rotation={-40} scale={1.35} windClass="leaf-wind-1" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={25} y={230} rotation={-60} scale={1.25} windClass="leaf-wind-1" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={85} y={320} rotation={-35} scale={1.4} windClass="leaf-wind-1" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={35} y={440} rotation={-55} scale={1.3} windClass="leaf-wind-1" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={95} y={880} rotation={-45} scale={1.4} windClass="leaf-wind-1" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={40} y={1010} rotation={-55} scale={1.3} windClass="leaf-wind-1" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={105} y={1350} rotation={-40} scale={1.35} windClass="leaf-wind-1" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={55} y={1480} rotation={-50} scale={1.25} windClass="leaf-wind-1" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />


        {/* === GROUP 2: MID-LEFT BRANCHES & CANOPY (Follows ~0.7s later) === */}
        <LeafSpray x={170} y={145} rotation={-30} scale={1.35} windClass="leaf-wind-2" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={240} y={245} rotation={-20} scale={1.4} windClass="leaf-wind-2" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={155} y={360} rotation={-35} scale={1.35} windClass="leaf-wind-2" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={260} y={455} rotation={-25} scale={1.4} windClass="leaf-wind-2" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={175} y={710} rotation={-30} scale={1.45} windClass="leaf-wind-2" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={240} y={970} rotation={-20} scale={1.4} windClass="leaf-wind-2" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={195} y={1260} rotation={-35} scale={1.3} windClass="leaf-wind-2" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={275} y={1420} rotation={-25} scale={1.35} windClass="leaf-wind-2" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />


        {/* === GROUP 3: CENTRAL CROWN & UPPER CANOPY (Follows ~1.4s later) === */}
        <LeafSpray x={350} y={120} rotation={-15} scale={1.35} windClass="leaf-wind-3" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={430} y={45} rotation={5} scale={1.4} windClass="leaf-wind-3" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={475} y={160} rotation={0} scale={1.45} windClass="leaf-wind-3" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={565} y={140} rotation={15} scale={1.4} windClass="leaf-wind-3" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={415} y={290} rotation={-5} scale={1.35} windClass="leaf-wind-3" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={505} y={385} rotation={10} scale={1.3} windClass="leaf-wind-3" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={375} y={530} rotation={-20} scale={1.4} windClass="leaf-wind-3" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />


        {/* === GROUP 4: MID-RIGHT CANOPY & BRANCHES (Follows ~2.1s later) === */}
        <LeafSpray x={665} y={110} rotation={25} scale={1.35} windClass="leaf-wind-4" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={730} y={215} rotation={30} scale={1.4} windClass="leaf-wind-4" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={645} y={345} rotation={20} scale={1.35} windClass="leaf-wind-4" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={770} y={385} rotation={35} scale={1.45} windClass="leaf-wind-4" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={700} y={670} rotation={25} scale={1.4} windClass="leaf-wind-4" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={810} y={845} rotation={35} scale={1.45} windClass="leaf-wind-4" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={745} y={1165} rotation={20} scale={1.35} windClass="leaf-wind-4" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={815} y={1370} rotation={30} scale={1.3} windClass="leaf-wind-4" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />


        {/* === GROUP 5: FAR-RIGHT CANOPY & MARGINS (Completes Wave ~2.8s later) === */}
        <LeafSpray x={875} y={70} rotation={45} scale={1.35} windClass="leaf-wind-5" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={965} y={120} rotation={40} scale={1.4} windClass="leaf-wind-5" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={1065} y={80} rotation={50} scale={1.3} windClass="leaf-wind-5" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={910} y={245} rotation={35} scale={1.4} windClass="leaf-wind-5" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={1015} y={285} rotation={45} scale={1.35} windClass="leaf-wind-5" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={1105} y={215} rotation={55} scale={1.25} windClass="leaf-wind-5" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={950} y={485} rotation={40} scale={1.4} windClass="leaf-wind-5" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />
        <LeafSpray x={1050} y={605} rotation={45} scale={1.35} windClass="leaf-wind-5" leafTone="#2E653E" accentTone="#407E52" highlightTone="#539366" />
        <LeafSpray x={970} y={805} rotation={35} scale={1.4} windClass="leaf-wind-5" leafTone="#346F46" accentTone="#468858" highlightTone="#599E6C" />
        <LeafSpray x={1010} y={1260} rotation={40} scale={1.35} windClass="leaf-wind-5" leafTone="#285936" accentTone="#387349" highlightTone="#4B885C" />

      </svg>
    </div>
  );
}
