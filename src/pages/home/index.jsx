import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { BsLinkedin, BsGithub, BsPersonWorkspace } from "react-icons/bs";
import { AiFillLike } from "react-icons/ai";
import {
  collection,
  getFirestore,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  query,
  where
} from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCHl93zKIrgpVfXUBW_sWSaR623DHFXMYs",
  authDomain: "page-recados-da-galera.firebaseapp.com",
  projectId: "page-recados-da-galera",
  storageBucket: "page-recados-da-galera.appspot.com",
});

export const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [github, setGithub] = useState("");
  const [recado, setRecado] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [areawork, setAreawork] = useState("");
  const [foto, setFoto] = useState("");
  const [likes, setLikes] = useState({});

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");


  async function createUser() {
    if (
      !name ||
      !email ||
      !github ||
      !recado ||
      !foto ||
      !areawork ||
      !linkedin
    ) {
      // Pelo menos um dos campos obrigatórios não foi preenchido
      alert("Preencha todos os campos obrigatórios.");
      return;
    }


    // Verifica se o email já existe
    const emailQuery = query(userCollectionRef, where("email", "==", email));
    const querySnapshot = await getDocs(emailQuery);
    if (!querySnapshot.empty) {
      alert("O email já está cadastrado.");
      return;
    }

    // Verifica se o GitHub já existe
    const githubQuery = query(userCollectionRef, where("github", "==", github));
    const querySnapshotGitHub = await getDocs(githubQuery);
    if (!querySnapshotGitHub.empty) {
      alert("O GitHub já está cadastrado.");
      return;
    }

    // Verifica se o LinkedIn já existe
    const linkedinQuery = query(
      userCollectionRef,
      where("linkedin", "==", linkedin)
    );
    const querySnapshotLinkedIn = await getDocs(linkedinQuery);
    if (!querySnapshotLinkedIn.empty) {
      alert("O LinkedIn já está cadastrado.");
      return;
    }

    // Todos os dados estão válidos, cria o usuário
    const user = await addDoc(userCollectionRef, {
      name,
      email,
      github,
      recado,
      foto,
      areawork,
      linkedin,
    });
    console.log(user);
    alert("Enviado com sucesso!");
    window.location.reload();
  }

  // Função para validar URL
  const validateURL = (url) => {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(url);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const likesData = data.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().likes || 0;
        return acc;
      }, {});
      setLikes(likesData);
    };
    getUsers();
  }, []);
  
  
  const handleLike = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const currentLikes = userSnapshot.data().likes || 0;
      const newLikes = currentLikes + 1;
      await updateDoc(userDoc, { likes: newLikes });
      setLikes((prevLikes) => ({ ...prevLikes, [userId]: newLikes }));
    }
  };
  

  return (
    <div className="bg-slate-300 flex flex-col items-center">
      <div className="flex m-0">
        <h1 className="text-[50px] text-gray-600 font-bold min-[300px]:max-lg:text-[1.5rem]">Compartilhe aqui uma Mensagem</h1>
      </div>
      <div className="flex max-w-[1050px] pt-[20px] pb-[50px] gap-3">
        <div className="flex gap-[20px] min-[300px]:max-lg:flex-col-reverse  ">
          <div
            id="contentprimary"
            className="overflow-y-auto mb-[20px] gap-2 flex max-w-[583px] min-w-[598px] max-h-[600px] min-[300px]:max-lg:min-w-[280px]"
          >
            <ul className="flex flex-col mb-2">
              {users.map((user) => {
                return (
                  <div
                    className="bg-slate-100 mb-[10px] shadow-lg rounded-2xl flex items-center justify-center min-w-[560px] min-[300px]:max-lg:min-w-[380px] max-w-[380px] "
                    key={user.id}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex p-3 min-[300px]:max-lg:flex-col items-center">
                        <img
                          className="rounded-full max-w-[130px]"
                          src={user.foto}
                          alt="Foto perfil"
                        />
                        <div className="flex flex-col mt-7 p-2 items-start">
                          <li className="text-2xl text-gray-600 font-bold min-[300px]:max-lg:text-lg">
                            {user.name}
                          </li>
                          <li className="text-gray-500">{user.email}</li>
                          <li className="flex items-center text-gray-400">
                            <BsPersonWorkspace />
                            {user.areawork}
                          </li>
                        </div>
                        <div className="flex items-center flex-col mt-12 ml-5 min-[300px]:max-lg:flex-row min-[300px]:max-lg:m-0">
                          <a
                            className="mb-3 text-blue-700 "
                            target="_blank"
                            href={user.linkedin}
                          >
                            <BsLinkedin className="text-[30px] min-[300px]:max-lg:text-[30px] mr-3" />
                          </a>
                          <a
                            className="mb-3"
                            target="_blank"
                            href={user.github}
                          >
                            <BsGithub className="text-[30px] min-[300px]:max-lg:text-[30px]" />
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col pb-5 min-[300px]:max-lg:m-3">
                        <h2 className="text-gray-600 font-bold pl-1">
                          Mensagem
                        </h2>
                        <p className="border-[2px] max-w-[420px] rounded-lg text-gray-600 p-4">
                          {user.recado}
                        </p>
                        <div className=" flex  items-center justify-end mr-4 mt-[-13px]">
                          {/* Contador de likes */}
                          <span className="bg-slate-100 text-gray-600 mr-1 flex items-center">
                            {likes[user.id]}
                          </span>
                          <button
                            className="bg-gray-200 rounded-lg flex items-center px-2 py-1"
                            onClick={() => handleLike(user.id)}
                          >
                            <AiFillLike />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center ml-11 flex-col gap-[1px] min-[300px]:max-lg:ml-0 ">
            <div className="h-[72px] ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
                Foto
              </label>
              <input
                className="rounded-lg flex w-[320px] h-[50px] items-center flex-shrink-0 pt-[11px] pb-[11px] pl-[21px] pr-[11px]"
                type="text"
                placeholder="Cole aqui url da sua foto"
                value={foto}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateURL(value) || value === "") {
                    setFoto(value);
                  }
                }}
              />
            </div>
            <div className="h-[78px] ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
                Nome Completo
              </label>
              <input
                className="rounded-lg flex w-[320px] h-[50px] items-center flex-shrink-0 pt-[11px] pb-[11px] pl-[21px] pr-[11px]"
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="h-[78px] ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
                Area que você atua
              </label>
              <input
                className="rounded-lg flex w-[320px] h-[50px] items-center flex-shrink-0 pt-[11px] pb-[11px] pl-[21px] pr-[11px]"
                type="text"
                placeholder="ex: Front-End"
                value={areawork}
                onChange={(e) => setAreawork(e.target.value)}
              />
            </div>

            <div className="h-[78px] ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
                E-mail
              </label>
              <input
                className="rounded-lg flex w-[320px] h-[50px] items-center flex-shrink-0 pt-[11px] pb-[11px] pl-[21px] pr-[11px]"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="h-[78px] ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
                GitHub
              </label>
              <input
                className="rounded-lg flex w-[320px] h-[50px] items-center flex-shrink-0 pt-[11px] pb-[11px] pl-[21px] pr-[11px]"
                type="text"
                placeholder="ex: https://github.com/seu-usuario"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>

            <div className="h-[78px] ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
                Linkedin
              </label>
              <input
                className="rounded-lg flex w-[320px] h-[50px] items-center flex-shrink-0 pt-[11px] pb-[11px] pl-[21px] pr-[11px]"
                type="text"
                placeholder="ex: https://www.linkedin.com/in/seu-usuario"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>

            <div className="h-[78px] flex flex-col ">
              <label className="text-gray-600 text-sm font-semibold leading-[24px] tracking-widest">
              Recado (mínimo 50 caracteres)
              </label>
              <textarea
                className="rounded-lg w-[320px] h-[100px] items-center flex-shrink-0 pt-[11px] pb-[1px] pl-[11px] pr-[11px]"
                type="text"
                placeholder="Escreva aqui uma mensagem"
                value={recado}
                onChange={(e) => setRecado(e.target.value)}
              />
            </div>
            <button
              className="text-gray-600 bg-lime-300 rounded-lg w-[320px] flex pt-[15px] pb-[15px] pl-[40px] pr-[40px] items-center gap-[20px] mt-14  flex-col"
              onClick={createUser}
            >
              ENVIAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
