import CrossSellSection from "@/components/student/CrossSellSection";

const AvailableServices = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Available Services
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore and purchase new services to enhance your learning journey
          </p>
        </div>
        <CrossSellSection />
      </div>
    </div>
  );
};

export default AvailableServices;
