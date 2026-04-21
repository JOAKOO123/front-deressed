import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Assistant from "../components/Assistant";
import OutfitCard from "../components/OutfitCard";
import TopBar from "../components/TopBar";
import { getOutfits } from "../services/api";

export default function Home() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOutfits();
      setOutfits(data);
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">

        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-6">
              Your Custom Outfits
            </h2>

            <div className="flex gap-4">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>

            <button className="mt-6 bg-black text-white px-6 py-2 rounded-lg">
              Build New Outfit
            </button>
          </main>

          <Assistant />
        </div>

      </div>
    </div>
  );
}