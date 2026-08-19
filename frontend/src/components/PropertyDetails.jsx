import { useState } from "react";
import PropertyDetailTab from "./PropertyDetailTab";

export default function PropertyDetails({
  interiorFeatures,
  exteriorFeatures,
}) {
  const INTERIOR = 0;
  const EXTERIOR = 1;

  const [activeTab, setActiveTab] = useState(INTERIOR);

  return (
    <div className="m-3">
      <div className="pb-2">
        <ul className="flex justify-start gap-5 list-image-none text-xl pt-3">
          <li
            className={
              activeTab === INTERIOR
                ? "underline underline-offset-4 decoration-3 font-bold"
                : "cursor-pointer"
            }
            onClick={() => setActiveTab(INTERIOR)}
          >
            Interior
          </li>
          <li
            className={
              activeTab === EXTERIOR
                ? "underline underline-offset-4 decoration-3 font-bold"
                : "cursor-pointer"
            }
            onClick={() => setActiveTab(EXTERIOR)}
          >
            Exterior
          </li>
        </ul>
      </div>
      {activeTab === INTERIOR ? (
        <PropertyDetailTab features={interiorFeatures} />
      ) : (
        <PropertyDetailTab features={exteriorFeatures} />
      )}
    </div>
  );
}