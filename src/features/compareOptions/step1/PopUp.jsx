import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useShipmentStore } from "@/store/shipmentStore";

export default function PopUp({ showSuccessPopup, setShowSuccessPopup }) {
  const wizardOptions = {
    "Shipper": {
  subOptions: [
    { 
      value: "DAP", 
      label: "DAP", 
      description: "Delivered at Place(named place of destination). The seller must deliver the cargo to the final defined destination. Once delivered, the cargo transfers to the buyer. The buyer must unload the shipment from the truck and is also responsible for import duties, taxes, and customs clearance. Read more about Incoterms here."  
    },
    { 
      value: "CPT", 
      label: "CPT", 
      description: "Carriage Paid To (named place of destination). The seller must deliver the cargo to the final defined destination. Once delivered, the cargo transfers to the buyer. The buyer must unload the shipment from the truck and is responsible for import duties, taxes, and customs clearance. Read more about Incoterms here." 
    }
  ]
},
"Consignee": {
  subOptions: [
    { 
      value: "EXW", 
      label: "EXW", 
      description: "Ex Works (named place of delivery). The seller is responsible for packing the products and making the goods available. The cargo is transferred to the buyer while the freight is still at the seller's site. The buyer is then responsible for exporting, shipping, and importing the cargo to their destination. Read more about Incoterms here."  
    },
    { 
      value: "FCA", 
      label: "FCA", 
      description: "Free Carrier (named place of delivery). The seller is responsible for transporting the cargo to a defined destination within the seller's country, usually a shipping terminal. Once the load has arrived at the designated destination, the shipment transfers to the buyer. The buyer must pay the freight charges and complete the importing and delivery process. Depending on the named place, the cargo is either exported by the seller or the buyer. Read more about Incoterms here." 
    }
  ]
},
"Booking Party": {
  subOptions: [
    { 
      value: "DAP", 
      label: "DAP", 
      description: "Delivered at Place of Destination. The seller must deliver the cargo to the final defined destination. Once delivered, the cargo transfers to the buyer, who must unload the shipment from the truck and is responsible for import duties, taxes, and customs clearance. Read more about Incoterms here." 
    },
    { 
      value: "CIF", 
      label: "CIF", 
      description: "Cost, Insurance & Freight (named port of destination). The seller is responsible for shipping and insuring the cargo to the buyer's requested port. Once the goods arrive at the port, responsibility transfers to the buyer, who must cover the costs to unload, import, and deliver their shipment. CIF requires the seller to purchase freight insurance (Maersk does not offer cargo insurance for LCL; the seller must have their own insurance certificate to release CIF B/L). Read more about Incoterms here." 
    },
    { 
      value: "CPT", 
      label: "CPT", 
      description: "Carriage Paid To (named place of destination). The seller must deliver the cargo to the final defined destination. Once delivered, the cargo transfers to the buyer, who must unload the shipment from the truck and is responsible for import duties, taxes, and customs clearance. Read more about Incoterms here." 
    },
    { 
      value: "CFR", 
      label: "CFR", 
      description: "Cost & Freight (named port of destination). The seller is responsible for transporting the cargo to the buyer's port. Once the goods arrive at the port, responsibility transfers to the buyer, who must unload and import the goods into the destination country, followed by delivering them to the final destination. Read more about Incoterms here." 
    },
    { 
      value: "EXW", 
      label: "EXW", 
      description: "Ex Works (named place of delivery). The seller is responsible for packing the products and making the goods available. The cargo is transferred to the buyer while the freight is still at the seller's site. The buyer is responsible for exporting, shipping, and importing the cargo to their destination. Read more about Incoterms here."  
    },
    { 
      value: "FOB", 
      label: "FOB", 
      description: "Free On Board (named port of shipment). The seller delivers when the goods are placed at the disposal of the buyer on the arriving means of transport, ready for unloading at the named place of destination. The seller bears all risks involved in bringing the goods to the named place. Read more about Incoterms here." 
    },
    { 
      value: "FCA", 
      label: "FCA", 
      description: "Free Carrier (named place of delivery). The seller is responsible for transporting the cargo to a defined destination within the seller's country, usually a shipping terminal. Once the load has arrived at the designated destination, the shipment transfers to the buyer, who must pay the freight charges and complete the importing and delivery process. Depending on the named place, the cargo is either exported by the seller or the buyer. Read more about Incoterms here." 
    }
  ]
}

  };

  const mainCategories = Object.keys(wizardOptions);
  const setWizardSelection = useShipmentStore(state => state.setWizardSelection);
  const [selectedMain, setSelectedMain] = useState(mainCategories[0]);
  const [selectedSub, setSelectedSub] = useState(wizardOptions[mainCategories[0]].subOptions[0].value);

  const handleMainSelect = (main) => {
    const firstSub = wizardOptions[main].subOptions[0];
    setSelectedMain(main);
    setSelectedSub(firstSub.value);
    setWizardSelection({
      mainCategory: main,
      subCategory: firstSub.value
    });
  };

  const handleSubSelect = (sub) => {
    setSelectedSub(sub.value);
    setWizardSelection({
      mainCategory: selectedMain,
      subCategory: sub.value
    });
  };

  const currentDescription = wizardOptions[selectedMain].subOptions.find(sub => sub.value === selectedSub)?.description;

  return (
    <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
    <DialogContent className="max-w-4xl p-0">
      <DialogHeader className="p-4">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-lg font-medium">Select Service Type</DialogTitle>
    </div>
  </DialogHeader>

  <div className="px-4 pb-4">
    {/* Main Categories */}
    <div className="flex gap-2 mb-4">
      {mainCategories.map((main) => (
        <Button
          key={main}
          variant={selectedMain === main ? "default" : "outline"}
          className={`h-10 px-4 rounded ${
            selectedMain === main 
              ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
              : "hover:bg-accent text-foreground"
          }`}
          onClick={() => handleMainSelect(main)}
        >
          {main}
        </Button>
      ))}
    </div>

    {/* Sub Options - Single line */}
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {wizardOptions[selectedMain].subOptions.map((sub) => (
        <Button
          key={sub.value}
          variant={selectedSub === sub.value ? "default" : "outline"}
          className={`shrink-0 h-10 rounded ${
            selectedSub === sub.value 
              ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
              : "hover:bg-accent text-foreground"
          }`}
          onClick={() => handleSubSelect(sub)}
        >
          {sub.label}
        </Button>
      ))}
    </div>

    {/* Description */}
    <div className="bg-muted p-3 rounded mb-4">
      <p className="text-sm text-muted-foreground">
        {currentDescription.replace("Read more about Incoterms here", '')}
        <a href="/incoterms" className="text-primary hover:underline ml-1">
          Read more about Incoterms here
        </a>
      </p>
    </div>

    {/* Footer */}
    <div className="pt-2 flex justify-center">
      <Button 
        onClick={() => setShowSuccessPopup(false)} 
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
      >
        Confirm
      </Button>
    </div>
  </div>
</DialogContent>

    </Dialog>
  );
}
