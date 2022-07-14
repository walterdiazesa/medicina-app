import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LandingPage from "../components/Pages/LandingPage";
import { Auth } from "../types/Auth";

const Home = ({ auth }: { auth?: Auth }) => {
  const router = useRouter();

  return (
    <div className="min-w-full max-w-full text-center">
      <LandingPage />
    </div>
  );
};

export default Home;
