import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LandingPage from "../components/Pages/LandingPage";
import { Auth } from "../types/Auth";

const Home = ({ auth }: { auth?: Auth }) => {
  const router = useRouter();

  return (
    <div className="min-w-full max-w-full text-center">
      {auth ? (
        <div className="text-center">
          <h1 className="mt-8 text-2xl font-bold">Flemik</h1>
          <button
            onClick={() => router.push("/test")}
            className="rounded-sm bg-zinc-50 hover:bg-zinc-100 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100"
          >
            Ver tests
          </button>
        </div>
      ) : (
        <LandingPage />
      )}
    </div>
  );
};

export default Home;
