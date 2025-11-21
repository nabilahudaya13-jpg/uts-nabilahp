"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface FormState {
  id: string;
  name: string;
  no_rm: string;
  date_of_birth: string;
  phone_number: string;
  address: string;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<FormState[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [validated, setValidated] = useState(false);

  const [form, setForm] = useState<FormState>({
    id: "",
    name: "",
    no_rm: "",
    date_of_birth: "",
    phone_number: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadData = () => {
    setLoading(true);
    api
      .get("/")
      .then((res) => setUsers(res.data.results.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      no_rm: "",
      date_of_birth: "",
      phone_number: "",
      address: "",
    });
    setIsEdit(false);
    setValidated(false);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    // Validasi bootstrap
    if (!formElement.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/${form.id}`, form);
        alert("Pasien berhasil diperbarui!");
      } else {
        const { id, ...newData } = form;
        await api.post("/", newData);
        alert("Pasien berhasil ditambahkan!");
      }
      loadData();
      resetForm();
    } catch (err) {
      console.log(err);
      alert("Gagal menyimpan data!");
    }
  };

  const handleEdit = (u: FormState) => {
    setForm(u);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus pasien ini?")) return;

    try {
      await api.delete(`/${id}`);
      alert("Berhasil dihapus!");
      loadData();
    } catch {
      alert("Gagal menghapus pasien!");
    }
  };

  return (
    <div className="container py-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">List Pasien</h3>
        <button className="btn btn-warning" onClick={resetForm}>
          Add New Pasien
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card p-4 mb-4 shadow-sm">
          <form noValidate className={validated ? "was-validated" : ""} onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Nama</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Nama wajib diisi.</div>
              </div>
              <div className="col-md-4">
                <label className="form-label">No RM</label>
                <input
                  type="text"
                  name="no_rm"
                  className="form-control"
                  value={form.no_rm}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">No RM wajib diisi.</div>
              </div>
              <div className="col-md-4">
                <label className="form-label">Tanggal Lahir</label>
                <input
                  type="date"
                  name="date_of_birth"
                  className="form-control"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Tanggal lahir wajib diisi.</div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nomor Telepon</label>
                <input
                  type="number"
                  name="phone_number"
                  className="form-control"
                  value={form.phone_number}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Nomor telepon wajib diisi.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Alamat</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Alamat wajib diisi.</div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No RM</th>
            <th>Tanggal Lahir</th>
            <th>Nomor Telepon</th>
            <th>Alamat</th>
            <th style={{ width: "120px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="text-center py-3">Loading...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-3">No Data</td></tr>
          ) : (
            users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.no_rm}</td>
                <td>{u.date_of_birth}</td>
                <td>{u.phone_number}</td>
                <td>{u.address}</td>
                <td className="d-flex gap-2 justify-content-center">
                  <button className="btn p-0" onClick={() => handleEdit(u)}>
                    <i className="bi bi-pencil-square text-primary fs-5"></i>
                  </button>
                  <button className="btn p-0" onClick={() => handleDelete(u.id)}>
                    <i className="bi bi-trash3 text-danger fs-5"></i>
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
