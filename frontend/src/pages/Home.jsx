import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100 py-4 px-2 md:px-0">
      <section className="max-w-7xl mx-auto mb-4 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
        <Header />
      </section>
      <section
        id="speciality"
        className="max-w-7xl mx-auto mb-4 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-teal-900 px-6 pt-6">
          Browse by Speciality
        </h2>
        <SpecialityMenu />
      </section>
      <section className="max-w-7xl mx-auto mb-4 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-teal-900 px-6 pt-6">
          Top Doctors
        </h2>
        <TopDoctors />
      </section>
      <section className="max-w-7xl mx-auto mb-4 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
        <Banner />
      </section>
    </main>
  );
};

export default Home;
