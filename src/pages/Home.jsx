import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import OutfitCard from "../components/OutfitCard";
import { authApi } from "../services/api";

export default function Home() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    // TODO: conectar al endpoint real de outfits cuando esté disponible
    setOutfits([]);
  }, []);

  return (
    <AppLayout>
      <div className="p-6 flex flex-col items-center justify-center min-h-full">
        <h2 className="text-xl font-semibold mb-6">Your Custom Outfits</h2>
        <div className="flex gap-4 flex-wrap justify-center">
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
        <button className="mt-6 bg-black text-white px-6 py-2 rounded-lg">
          Build New Outfit
        </button>
      </div>
    </AppLayout>
  );
}