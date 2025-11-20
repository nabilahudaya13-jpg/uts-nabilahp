"use client";
import api from "@/lib/axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import React, { useEffect, useState } from "react";

export default function Home() {

  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FORM STATE
  const [form, setForm] = useState({
     id: undefined as string | undefined,
    name: "",
    no_rm: "",
    date_of_birth: "",
    phone_number: "",
    address: "",
  });

  // Mode Edit
  const [isEdit, setIsEdit] = useState(false);

  // Handle input
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // GET DATA
  const loadData = () => {
    api.get("/")
      .then((res: any) => {
        setUsers(res.data.results.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // SUBMIT (ADD / UPDATE)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEdit) {
        // UPDATE DATA
        await api.put(`/${form.id}`, form);
        alert("Pasien berhasil diperbarui!");
      } else {
        // ADD DATA
        let newData = { ...form };
        delete newData.id;
        await api.post("/", newData);
        alert("Pasien berhasil ditambahkan!");
      }

      loadData();

      // reset
      setForm({
        id: "",
        name: "",
        no_rm: "",
        date_of_birth: "",
        phone_number: "",
        address: "",
      });
      setIsEdit(false);
      setShowForm(false);

    } catch (error) {
      console.log(error)
      alert("Gagal menyimpan data!");
    }
  };

  // EDIT BUTTON ACTION
  const handleEdit = (u: any) => {
    setForm({
      id: u.id,
      name: u.name,
      no_rm: u.no_rm,
      date_of_birth: u.date_of_birth,
      phone_number: u.phone_number,
      address: u.address,
    });

    setIsEdit(true);
    setShowForm(true);
  };

  // DELETE BUTTON ACTION
  const handleDelete = async (id: any) => {
    if (!confirm("Yakin hapus pasien ini?")) return;

    try {
      await api.delete(`/${id}`);
      alert("Berhasil dihapus!");
      loadData();
    } catch (error) {
      alert("Gagal menghapus pasien!");
    }
  };

  return (
    <div className="p-5">

      {/* Header */}
      <div className="mb-5 row d-flex justify-content-between">
        <div className="col-lg-6">
          <p className="fs-2 fw-bold">List Pasien</p>
        </div>

        <div className="col-lg-6 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-warning"
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setForm({
                id: "",
                name: "",
                no_rm: "",
                date_of_birth: "",
                phone_number: "",
                address: "",
              });
            }}
          >
            Add New Pasien
          </button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form-inputan mb-5 p-4 border rounded bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col">
                <input
                  type="hidden"
                  className="form-control"
                  placeholder="Input Nama"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukan Nama"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukan No RM"
                  name="no_rm"
                  value={form.no_rm}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Masukan Nomor Telepon"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukan Alamat"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="col d-flex align-items-end">
                <button type="submit" className="btn btn-danger w-100">
                  {isEdit ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No Rm</th>
            <th>Tanggal Lahir</th>
            <th>Nomor Telepon</th>
            <th>Alamat</th>
            <th style={{ width: "120px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center">Loading...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">No Data</td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.no_rm}</td>
                <td>{u.date_of_birth}</td>
                <td>{u.phone_number}</td>
                <td>{u.address}</td>
                <td className="d-flex gap-2">

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    className="btn p-0"
                    onClick={() => handleDelete(u.id)}
                  >
                    <i className="bi bi-trash3 text-danger fs-5"></i>
                  </button>

                  {/* EDIT BUTTON */}
                  <button
                    type="button"
                    className="btn p-0"
                    onClick={() => handleEdit(u)}
                  >
                    <i className="bi bi-pencil-square text-primary fs-5"></i>
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}
