import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Form({ formData, formNewMovie = true }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: formData.title,
    plot: formData.plot,
  });
  const [message, setMesaage] = useState([]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formNewMovie) {
      postData(form);
    } else {
      //editar
      putData(form);
    }
  };
  const putData = async (form) => {
    setMesaage([])
    const { id } = router.query;
    try {
      const res = await fetch(`/api/movie/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMesaage((oldmessage) => [
            ...oldmessage,
            { message: error.message },
          ]);
        }
      } else {
        setMesaage([])
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const postData = async (form) => {
    try {
      console.log(form);
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMesaage((oldmessage) => [
            ...oldmessage,
            { message: error.message },
          ]);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control my-2 w-50"
        placeholder="Title"
        autoComplete="off"
        name="title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        type="text"
        className="form-control my-2 w-50"
        placeholder="Plot"
        autoComplete="off"
        name="plot"
        value={form.plot}
        onChange={handleChange}
      />
      <button className="btn btn-primary w-25" type="submit">
        {formNewMovie ? "Agregar" : "Actualizar"}
      </button>
      <Link href={"/"} className="btn btn-warning w-25">
        Regresar...
      </Link>
      {message.map((item) => (
        <p key={item.message}>{item.message}</p>
      ))}
    </form>
  );
}

export default Form;
