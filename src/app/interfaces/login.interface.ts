import { Usuario } from "./usuario.interface";

export interface LoginUsuario{
    "status"     : string,
	"message"    : string,
	"accessToken": string,
	"expiresIn"  : number,
	"user"       : Usuario
}