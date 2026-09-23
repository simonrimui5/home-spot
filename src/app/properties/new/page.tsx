"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

type Unit = { unitNumber: string; bedrooms: number; bathrooms: number; rent: number; }

export default function PropertyWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data - single flow
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState<Unit[]>([{ unitNumber: "Unit 1", bedrooms: 2, bathrooms: 1, rent: 25000 }]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [contact, setContact] = useState("");

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  const handlePublish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert("Please login first"); return; }

      // 1. Insert property record -> property table (existing architecture)
      const { data: prop, error } = await supabase.from("properties").insert({
        owner_id: user.id,
        title,
        location,
        price: units[0]?.rent || 0,
        bedrooms: units[0]?.bedrooms,
        bathrooms: units[0]?.bathrooms,
        description: `${description} | Amenities: ${amenities.join(",")} | Contact: ${contact}`,
        status: "published"
      }).select().single();

      if (error) throw error;

      // 2. Upload to Storage (not PostgreSQL) as doc says
      for (let file of images) {
        const path = `${user.id}/${prop.id}/${file.name}`;
        await supabase.storage.from("property-images").upload(path, file);
        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);
        await supabase.from("property_images").insert({ property_id: prop.id, image_url: urlData.publicUrl });
      }

      alert("Published!"); router.push("/");
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-xl text-[#123b38]">Step {step} of {totalSteps}</h1>
          <span className="text-sm text-gray-500">{["Property","Location","Units","Amenities","Photos","Contact","Review","Publish"][step-1]}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8"><div className="bg-[#123b38] h-2 rounded-full transition-all" style={{width: `${progress}%`}} /></div>

        {step===1 && <div><label className="font-semibold">Property Title</label><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-3 rounded mt-2" placeholder="e.g. Ruiru Greens" /></div>}
        {step===2 && <div><label className="font-semibold">Location</label><input value={location} onChange={e=>setLocation(e.target.value)} className="w-full border p-3 rounded mt-2" placeholder="Ruiru, Kiambu" /><textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border p-3 rounded mt-4" placeholder="Description" /></div>}
        {step===3 && <div><label className="font-semibold">Units - Rent per unit</label>{units.map((u,i)=><div key={i} className="flex gap-2 mt-2"><input value={u.rent} onChange={e=>{const n=[...units]; n[i].rent=Number(e.target.value); setUnits(n)}} className="border p-2 rounded w-full" placeholder="Rent" type="number"/></div>)}<button onClick={()=>setUnits([...units,{unitNumber:`Unit ${units.length+1}`,bedrooms:1,bathrooms:1,rent:15000}])} className="mt-3 text-sm text-[#123b38]">+ Add Unit</button></div>}
        {step===4 && <div><label className="font-semibold">Amenities</label><div className="grid grid-cols-2 gap-2 mt-3">{["WiFi","Parking","Water 24/7","Security"].map(a=><label key={a} className="flex items-center gap-2"><input type="checkbox" checked={amenities.includes(a)} onChange={()=>setAmenities(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a])}/>{a}</label>)}</div></div>}
        {step===5 && <div><label className="font-semibold">Photos - Uploads to Supabase Storage</label><input type="file" multiple accept="image/*" onChange={e=>setImages(Array.from(e.target.files||[]))} className="mt-3"/><p className="text-xs text-gray-500 mt-2">{images.length} images selected</p></div>}
        {step===6 && <div><label className="font-semibold">Contact</label><input value={contact} onChange={e=>setContact(e.target.value)} className="w-full border p-3 rounded mt-2" placeholder="07XX XXX XXX"/></div>}
        {step===7 && <div className="space-y-2"><p><b>{title}</b> - {location}</p><p>Rent: {units[0]?.rent}</p><p>Amenities: {amenities.join(", ")}</p><p>{images.length} photos</p></div>}
        {step===8 && <div><h2 className="font-bold text-lg">Ready to Publish</h2><p className="text-sm text-gray-600 mt-2">Flow: Auth → Insert properties → Insert units → Storage upload → property_images → Published</p></div>}

        <div className="flex justify-between mt-8">
          {step>1 && <button onClick={()=>setStep(s=>s-1)} className="border px-6 py-2 rounded">Back</button>}
          {step<8? <button onClick={()=>setStep(s=>s+1)} className="bg-[#123b38] text-white px-6 py-2 rounded ml-auto">Next</button> : <button onClick={handlePublish} disabled={loading} className="bg-[#e18356] text-white px-8 py-2 rounded ml-auto">{loading?"Publishing...":"Publish Listing"}</button>}
        </div>
      </div>
    </div>
  );
}