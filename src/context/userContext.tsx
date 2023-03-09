import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IAddress, IUserModal } from "../components/ModalEditUSer";
import { IChildren, IUserResponse } from "../interfaces";
import { IRegister } from "../pages/Register";
import { api } from "../services";

export interface IUserContextProps {
  registerUser: (user: IRegister) => Promise<void>;
  loginUser: (user: any) => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalEditUser: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalEditAddress: React.Dispatch<React.SetStateAction<boolean>>;
  userRecovery: (data: IUserRecovery) => Promise<any>;
  editUser: (data: IUserModal) => Promise<void>;
  getUserAdivertiser: (userId: string) => Promise<void>;
  openModalDeleteUser: boolean;
  setOpenModalDeleteUser: (value: boolean) => void;
  editAddressUser: (data: IAddress) => Promise<void>;
  user: IUserResponse["user"] | undefined;
  logout: () => void;
  loading: boolean;
  openModalEditUser: boolean;
  openModalEditAddress: boolean;
  registerErrors: IRegisterErrors;
  setRegisterErrors: React.Dispatch<React.SetStateAction<IRegisterErrors>>;
  userAdvertiser: IUserResponse["user"] | undefined;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cellphone: string;
  description: string;
  dateOfBirth: Date;
  isAdvertiser?: boolean;
  isActive?: boolean;
  img?: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

interface IUserRecovery {
  email: string;
  password?: string;
  token?: string;
}

export interface IRegisterErrors {
  email?: string;
  cpf?: string;
  cellphone?: string;
}

export const UserContext = createContext<IUserContextProps>(
  {} as IUserContextProps
);
export const UserProvider = ({ children }: IChildren) => {
  const [user, setUser] = useState<IUserResponse["user"] | undefined>();
  const [registerErrors, setRegisterErrors] = useState<IRegisterErrors>(
    {} as IRegisterErrors
  );
  const [userAdvertiser, setUserAdvertiser] = useState<
    IUserResponse["user"] | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const [openModalEditUser, setOpenModalEditUser] = useState<boolean>(false);
  const [openModalEditAddress, setOpenModalEditAddress] =
    useState<boolean>(false);

  const [openModalDeleteUser, setOpenModalDeleteUser] =
    useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("@motorshop: token");
      const userId = localStorage.getItem("@motorshop: userId");
      if (token) {
        try {
          const { data } = await api.get(`/users/${userId}`);
          setUser(data);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const registerUser = async (user: IRegister): Promise<void> => {
    await api
      .post("/users", user)
      .then((res) => {
        toast.success(" Conta criada!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/login/");
      })
      .catch((err) => {
        const errorMessage = err.response.data.message;

        setRegisterErrors(errorMessage);
      });
  };
  const loginUser = async (user: IUserLogin) => {
    try {
      const { data } = await api.post("/login", user);
      setUser(data.user);
      localStorage.setItem("@motorshop: token", data.token);
      localStorage.setItem("@motorshop: userId", data.user.id);
      toast.success(" Bem vindo!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      if (data.user.isAdvertiser) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      localStorage.clear();
      toast.error("Ops! Tem algo errado! Verifique seu e-mail e senha !");
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    location.reload();
    navigate("/");
  };

  const userRecovery = async (data: IUserRecovery) => {
    const email = data.email;
    if (data.token) {
      toast.success("Senha alterada!", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return await api
        .patch(
          "/users/",
          { password: data.password },
          { headers: { Authorization: `Bearer ${data.token}` } }
        )
        .then(() => navigate("/login"));
    }
    toast.success("Email enviado!", {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

    await api.post("/users/recovery", { email });
  };

  const editUser = async (data: IUserModal) => {
    const userToken: string | null = localStorage.getItem("@motorshop: token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    !data.name && delete data.name;
    !data.email && delete data.email;
    !data.cpf && delete data.cpf;
    !data.cellphone && delete data.cellphone;
    !data.dateOfBirth && delete data.dateOfBirth;
    !data.description && delete data.description;

    await api.patch("/users/", data, config).then((res) => {
      setUser(res.data);
      toast.success("Dados Alterado com sucesso");
      setOpenModalEditUser(false);
    });
  };
  const editAddressUser = async (data: IAddress) => {
    const userToken: string | null = localStorage.getItem("@motorshop: token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    !data.cep && delete data.cep;
    !data.state && delete data.state;
    !data.city && delete data.city;
    !data.street && delete data.street;
    !data.number && delete data.number;
    !data.complement && delete data.complement;

    await api.patch("/address", data, config).then((res) => {
      setOpenModalEditAddress(false);
      toast.success("Endereço alterado com sucesso");
    });
  };

  const getUserAdivertiser = async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    setUserAdvertiser(data);
  };

  return (
    <UserContext.Provider
      value={{
        loginUser,
        openModalDeleteUser,
        setOpenModalDeleteUser,
        registerUser,
        user,
        loading,
        setLoading,
        userRecovery,
        logout,
        editUser,
        setOpenModalEditUser,
        openModalEditUser,
        editAddressUser,
        openModalEditAddress,
        setOpenModalEditAddress,
        registerErrors,
        setRegisterErrors,
        getUserAdivertiser,
        userAdvertiser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
