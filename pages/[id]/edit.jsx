import Form from "@/components/Form";
import { useRouter } from "next/router";
import useSWM from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("Error ocurrido por fetcher");

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  const { data } = await res.json();
  return data;
};

function Edit() {
  const router = useRouter();
  const { id } = router.query;

  const { data: movie, error } = useSWM(
    id ? `/api/movie/${id}` : null,
    fetcher
  );

  if (error) {
    return <div className="container">Error</div>;
  }

  if (!movie) {
    return (
      <div className="container mt-5 text-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  const formData = {
    title: movie.title,
    plot: movie.plot,
  };
  return (
    <div className="container">
      <h1>Editar Movie</h1>
      <Form formNewMovie={false} formData={formData} />
    </div>
  );
}

export default Edit;
