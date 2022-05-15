import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen max-h-screen min-w-full max-w-full text-center">
      <h1 className="mt-8 text-2xl font-bold">Medical</h1>
      <button
        onClick={() => router.push("/test")}
        className="rounded-sm bg-zinc-50 hover:bg-zinc-100 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100"
      >
        Ver tests
      </button>
    </div>
  );
};

export default Home;
