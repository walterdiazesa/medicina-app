import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Auth } from "../types/Auth";

const Home = ({ auth }: { auth?: Auth }) => {
  const router = useRouter();

  return (
    <div className="min-w-full max-w-full text-center">
      <h1 className="mt-8 text-2xl font-bold">Medical</h1>
      {auth ? (
        <button
          onClick={() => router.push("/test")}
          className="rounded-sm bg-zinc-50 hover:bg-zinc-100 px-6 py-2 shadow-md my-2 hover:scale-105 transition duration-100"
        >
          Ver tests
        </button>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-600">
            Medical, un SaaS para sacarle el jugo a tu CHEM
          </h2>
          <h2 className="text-lg text-gray-600">
            ¿No tienes un laboratorio?{" "}
            <Link href="/register">
              <span className="text-teal-500 font-semibold cursor-pointer hover:text-teal-600">
                Crea uno
              </span>
            </Link>
          </h2>
        </>
      )}
    </div>
  );
};

export default Home;
