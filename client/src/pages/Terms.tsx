import React from 'react'
import { Avatar } from '../components/Icon/Avatar'

type Props = {
  device: string
}

export const Terms: React.FC<Props> = ({device}) => {
  return (

    <main className="flex flex-col bg-white w-full gap-2 font-poppins items-center">    
      <div className="container flex flex-col  border ">
      <header className="h-16 w-full flex flex-col justify-center items-center">
        <nav className="w-full bg-slate-800 border p-10 h-full flex items-center">
          <ul className="w-full h-full flex items-center justify-center">
            <li className='text-white'>
              <Avatar role="assistant" size="48" />
              Aisac
            </li>
          </ul>
        </nav>
      </header>
        <section className="w-full flex max-md:flex-col items-center gap-10 max-md:gap-1 px-40 max-md:px-0 md:pt-20 md:bg-sky-600 rounded-b-3xl">
          <div className="flex flex-col mb-10">
            <h1 className="text-2xl max-md:text-lg font-bold md:text-white max-md:mt-10">14 de junio 2024</h1>

            <h1 className="text-3xl max-md:text-xl">Términos y condiciones</h1>
          </div>
          <article className="w-2/5 max-md:w-full h-full text-justify flex items-center max-md:px-4 max-md:text-lg">
            Al utilizar el Servicio de Inteligencia Artificial para Consultas
            Académicas de la Universidad Nacional Experimental Rómulo Gallegos,
            mejor conocido como AISAC o Aisac, usted (el usuario del Servicio, el
            usuario de dicho usuario) sucesores, agentes y docentes, y todos los
            que tengan relación con dicho usuario son, en lo sucesivo, "Usted".
            aceptan estar sujetos a los siguientes términos y condiciones.
          </article>
        </section>

        <div className='flex my-20'>
          <div className='flex flex-col gap-20'>
            <section className="px-40 max-md:px-0 flex justify-between max-md:flex-col">
              <div>
                <h1 className="text-2xl mb-5 max-md:text-center">Términos del Servcio</h1>
                <article className="max-md:text-lg max-md:px-4 text-justify">
                  <ol
                    className="flex flex-col gap-2 max-w-md space-y-1 text-gray-800 list-decimal list-inside"
                  >
                    <li>Debe ser estudiante de la institución</li>
                    <li>
                      Debe proporcionar algún dato que se le sea requerido, como su
                      nombre o correo electrónico, etc. A menos que se pueda omitir.
                    </li>
                    <li>
                      Debe considerar que no siempre la información que devuelve el
                      servicio es 100% efectiva.
                    </li>
                    <li>
                      Usted estudiante, es responsable del manejo y uso de información
                      a través del servicio.
                    </li>
                    <li>
                      Usted docente, es responsable de difundir información válida y
                      coherente.
                    </li>
                  </ol>
                </article>
              </div>
            </section>

            <section className="flex justify-between px-40 max-md:px-0 max-md:flex-col-reverse">
              <div>
                <h1 className="text-2xl max-md:text-center">Condiciones Generales</h1>
                <article className="mt-2 max-md:text-lg max-md:px-4 text-justify">
                  <ol
                    className="flex flex-col gap-2 max-w-md space-y-1 text-gray-800 list-decimal list-inside "
                  >
                    <li>
                      Su uso del Servicio es bajo su propio riesgo. El servicio se
                      proporciona "tal cual" y "según disponibilidad".
                    </li>
                    <li>
                      El abuso textual o palabras groseras no están permitidas y se
                      concidera una penalización. 3 No debe cargar, publicar, alojar ni
                      transmitir correos electrónicos, SMS o mensajes de "spam" no
                      solicitados.
                    </li>
                    <li>
                      No debe transmitir ningún gusano o virus ni ningún código de
                      naturaleza destructiva.
                    </li>
                    <li>
                      No puede utilizar AISAC para ningún propósito ilegal o no
                      autorizado. No debe, en el uso del Servicio, violar ninguna ley en
                      su jurisdicción (incluidas, entre otras, las leyes de derechos de
                      autor o marcas comerciales).
                    </li>
                    <li>
                      Aisac no garantiza que cumplirá con sus requisitos específicos.
                    </li>
                    <li>
                      Usted se compromete a no reproducir, duplicar, copiar, vender,
                      revender o explotar ninguna parte del Servicio, el uso del
                      Servicio o el acceso al Servicio sin el permiso expreso por
                      escrito del creado de AISAC.
                    </li>
                    <li>
                      No puede subir documentos o imágenes que tengan contenido
                      pornográfico, violencia, discriminación, racismo, política y
                      comercio de productos.
                    </li>
                    <li>
                      Los archivos que suba para mejorar el modelo de inteligencia
                      artificial, serán revisados antes de su publicación. 10 Acepta que
                      el Servicio utiliza Cookies.
                    </li>
                    <li>
                      Si alguna disposición del presente documento, o la aplicación de
                      dicha disposición a cualquier persona o circunstancia, es
                      declarada inválida por un tribunal o árbitro, el el resto de los
                      términos del presente documento, o la aplicación de dicha(s)
                      disposición(es) a personas o circunstancias distintas de aquellas
                      en las que se considera inválida, no se verán afectados por ello.
                      Los términos restantes se interpretarán de manera coherente con
                      los términos y objetivos establecidos en el presente documento
                      para dar la mejor manera posible a la la intención de las partes.
                    </li>
                  </ol>
                </article>
              </div>

            </section>            
          </div>
          {device == 'desktop' && 
          <div className='flex flex-col w-1/2 h-screen'>
            <img src='https://t4.ftcdn.net/jpg/05/16/31/55/360_F_516315574_QVHjedFRyaKTvRwwVlwKalSVmXAvh4ED.jpg' alt='legals' className='h-full'/>

            <section className="flex justify-start w-full px-40 max-md:px-0 max-md:flex-col">
              <div>
                <h1 className="text-2xl max-md:text-center">Modificaciones al Servicio</h1>
                <article className="mt-2 max-md:text-lg max-md:px-4 text-justify">
                  <ol className="flex flex-col gap-2 max-w-md space-y-1 text-gray-800 list-decimal list-inside">
                    <li>
                      El creador de AISAC se reserva el derecho en cualquier momento y de
                      vez en cuando de modificar o interrumpir, temporal o permanentemente,
                      el Servicio (o cualquier parte con o sin previo aviso).
                    </li>
                    <li>
                      El creador de
                      AISAC no será responsable ante usted ni ante ningún tercero por
                      cualquier modificación, suspensión o interrupción del Servicio.
                    </li>
                  </ol>
                </article>
              </div>
            </section>
          
          </div>
          }
        </div>
        <section className="flex justify-between px-40 max-md:px-0 flex-col">
          <h1 className="text-2xl text-center">Derechos de autor y propiedad del contenido</h1>
          <article className="mt-2 max-md:px-4 text-lg text-justify">
            La apariencia del Servicio es propiedad del creador de AISAC. Todos los
            derechos reservados. No puede duplicar, copiar ni reutilizar ninguna parte
            del HTML/CSS, Javascript o elementos o conceptos de diseño visual sin el
            permiso expreso por escrito del creador.
          </article>
        </section>
        <div className='flex justify-center w-full bg-slate-800 h-20 items-center text-xl text-white'>
        Copyright © 2024. All rights reserved.
      </div>
      </div>
      
    </main>
  )
}