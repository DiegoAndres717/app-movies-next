import conectarDB from "@/lib/dbConnect";
import Movie from "@/models/Movie";
import Link from "next/link";
import { useRouter } from "next/router";

function MoviePage({ success, error, movie }) {
  /* console.log(success);
  console.log(error);
  console.log(movie); */

  const router = useRouter()

  if (!success) {
    return (
      <div className="container text-center my-5">
        {error} 🤦‍♂️
        <Link className="btn btn-success" href={"/"}>
          Volver a inicio
        </Link>
      </div>
    );
  }
  const deleteData = async(id) => {
    try {
      await fetch(`/api/movie/${id}`, {
        method: 'DELETE'
      })
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="container">
      <h1>Detalle de Movie</h1>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h5 className="text-uppercase">{movie.title}</h5>
          </div>
          <p className="fw-light">{movie.plot}</p>
          <Link className="btn btn-success btn-sm me-2" href={"/"}>
            Volver a inicio
          </Link>
          <Link className="btn btn-warning btn-sm me-2" href={`/${movie._id}/edit`}>
            Editar
          </Link>
          <button className="btn btn-danger btn-sm" onClick={ () => deleteData(movie._id)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;

export async function getServerSideProps({ params }) {
  try {
    await conectarDB();
    const movie = await Movie.findById(params.id).lean();
    if (!movie) {
      return {
        props: { success: false, error: "Pelicula no encontrada" },
      };
    }
    console.log(movie);
    movie._id = `${movie._id}`;

    return {
      props: { success: true, movie },
    };
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return {
        props: { success: false, error: "Id no válido" },
      };
    }
    return {
      props: { success: false, error: "Error de servidor" },
    };
  }
}
