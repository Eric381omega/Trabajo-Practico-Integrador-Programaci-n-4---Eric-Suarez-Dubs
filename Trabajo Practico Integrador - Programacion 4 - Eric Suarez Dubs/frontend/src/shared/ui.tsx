import type {ReactNode} from 'react'
export function Button({children,...props}:{children:ReactNode;onClick?:()=>void;type?:'button'|'submit';disabled?:boolean}){return <button className="btn" {...props}>{children}</button>}
export function Card({children}:{children:ReactNode}){return <section className="panel">{children}</section>}
export function Field(props:React.InputHTMLAttributes<HTMLInputElement>){return <input className="field" {...props}/>}
export function Message({children}:{children:ReactNode}){return <p className="muted">{children}</p>}
export function ErrorText({children}:{children:ReactNode}){return <p className="error">{children}</p>}
