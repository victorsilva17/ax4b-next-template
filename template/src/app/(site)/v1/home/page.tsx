export default function HomePage() {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Página Inicial</h1>
      <p className="mt-4">
        Created by{" "}
        <a
          href="https://nextjs.org/docs/pages/api-reference/create-next-app"
          target="_blank"
          className="text-orange-500"
          rel="noreferrer"
        >
          create-next-app
        </a>{" "}
        and personalized by{" "}
        <span className="text-blue-700 font-bold">avorb</span>
      </p>
      <span className="text-gray-400 text-sm">
        Construa sua página Home aqui
      </span>
    </div>
  );
}
