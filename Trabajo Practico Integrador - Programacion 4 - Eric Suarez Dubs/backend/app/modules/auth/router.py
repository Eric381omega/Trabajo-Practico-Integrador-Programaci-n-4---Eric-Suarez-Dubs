from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.modules.auth.service import AuthService
from app.modules.auth.schemas import Message
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.core.deps import get_current_active_user
from app.modules.usuarios.models import Usuario

router=APIRouter(prefix="/auth",tags=["Autenticación"])
service=AuthService()

@router.post("/register",response_model=UserPublic,status_code=201)
def register(data:UserCreate): return service.register(data)

@router.post("/token",response_model=Message)
def login(response:Response,form:OAuth2PasswordRequestForm=Depends()):
    token=service.login(form.username,form.password)
    response.set_cookie("access_token",token,httponly=True, max_age=1800, samesite="lax", secure=False, path="/")
    return {"message":"Login exitoso"}

@router.post("/logout",response_model=Message)
def logout(response:Response):
    response.delete_cookie("access_token",path="/")
    return {"message":"Logout exitoso"}

@router.get("/me",response_model=UserPublic)
def me(user:Usuario=Depends(get_current_active_user)): return UserPublic.model_validate(user)
