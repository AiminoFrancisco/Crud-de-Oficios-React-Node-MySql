import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();
  const [empleadosList, setEmpleadosList] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Empleado Registrado!</strong>",
        html: "El empleado <strong> " + nombre + " </strong>fue registrado con exito!",
        icon: "success",
        timer: 2200
      });
    });
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleadosList(response.data);
    })
  }

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
      id: id,
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Empleado Actualizado Con Exito!</strong>",
        icon: "success",
        timer: 2200
      });
    })
  }

  const deleteEmpleados = (val) => {
    Swal.fire({
      title: "Confirmar eliminación?",
      html: "Realmente desea eliminar a  <strong> " + val.nombre + " </strong>de la tabla ???",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados();
          limpiarCampos();
          Swal.fire({
            icon: "success",
            title: "<strong> " + val.nombre + " </strong>fue eliminado",
            showConfirmButton: false,
            timer: 2000
          });
        }).catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
          })
        })
      }
    });
  }

  const editarEmpleados = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setId(val.id);

  }
  const limpiarCampos = () => {
    setNombre("")
    setEdad("")
    setPais("")
    setCargo("")
    setAnios("")
    setEditar(false)
  }

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: "#D3D5D4" }} >
      <div className='container' >
        <div className="card text-center ">
          <div className="card-header" style={{ fontSize: "23px" }}>
            GESTIÓN DE OFICIOS
          </div>
          <div className="card-body ">
            <div className="input-group mb-3 ">
              <span style={{ backgroundColor: "#CFD9FF" }} className="input-group-text  text-black" id="basic-addon1"  >Nombre:</span>
              <input type="text" placeholder="Ingrese su Nombre" value={nombre} className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => {
                setNombre(event.target.value)
              }} />
            </div>
            <div className="input-group mb-3">
              <span style={{ backgroundColor: "#CFD9FF" }} className="input-group-text  text-black" id="basic-addon1">Edad:</span>
              <input type="number" placeholder="Ingrese su edad" value={edad} className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => {
                setEdad(event.target.value)
              }} />
            </div>
            <div className="input-group mb-3">
              <span style={{ backgroundColor: "#CFD9FF" }} className="input-group-text  text-black" id="basic-addon1">Pais:</span>
              <input type="text" placeholder="Pais" value={pais} className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => {
                setPais(event.target.value)
              }} />
            </div>
            <div className="input-group mb-3">
              <span style={{ backgroundColor: "#CFD9FF" }} className="input-group-text  text-black" id="basic-addon1">Oficio:</span>
              <input type="text" placeholder="Ingrese su profesión" value={cargo} className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => {
                setCargo(event.target.value)
              }} />
            </div>
            <div className="input-group mb-3">
              <span style={{ backgroundColor: "#CFD9FF" }} className="input-group-text  text-black" id="basic-addon1">Años de Experiencia:</span>
              <input type="number" placeholder="Ingrese sus años de experiencia." value={anios} className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => {
                setAnios(event.target.value)
              }} />
            </div>
          </div>
          <div className="card-footer text-muted">
            {
              editar ?
                <div>
                  <button className="btn btn-info m-2" onClick={limpiarCampos}>Cancelar</button>
                  <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
                </div> :
                <button className="btn btn-success " style={{ fontSize: '26px' }} onClick={add}>Registrar</button>
            }
          </div>
        </div>
        <table className="table table-secondary" >
          <thead >
            <tr >
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Pais</th>
              <th scope="col">Oficio</th>
              <th scope="col">Experiencia</th>
              <th scope="col">Acciónes</th>
            </tr>
          </thead>
          <tbody>
            {
              empleadosList.map((val, key) => {
                return <tr key={val.id}>
                  <th>{val.id}</th>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.pais}</td>
                  <td>{val.cargo}</td>
                  <td>{val.anios}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button
                        style={{ backgroundColor: "#FAF9A7" }}
                        onClick={() => {
                          editarEmpleados(val);
                        }}

                        type="button" className="btn">Editar</button>
                      <button
                        onClick={() => {
                          deleteEmpleados(val)
                        }}
                        type="button" className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;