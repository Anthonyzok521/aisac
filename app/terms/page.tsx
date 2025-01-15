import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditions() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-col items-center space-y-4">
                        <span className="text-2xl font-bold">
                            14 de junio 2024
                            Términos y condiciones
                        </span>
                        <span className="text-md font-light">
                            Al utilizar el Servicio de Inteligencia Artificial para Consultas Académicas de la Universidad Nacional Experimental Rómulo Gallegos, mejor conocido como AISAC o Aisac, usted (el usuario del Servicio, el usuario de dicho usuario) sucesores, agentes y docentes, y todos los que tengan relación con dicho usuario son, en lo sucesivo, "Usted". aceptan estar sujetos a los siguientes términos y condiciones.
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none flex flex-col gap-5 p-5 text-justify">
                    <div>
                    <h2>1. Aceptación de los términos</h2>
                    <p>
                        Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice nuestro sitio.
                    </p>
                    </div>

                    <div>
                    <h2>2. Uso del sitio</h2>
                    <p>
                        Usted se compromete a utilizar este sitio web únicamente para fines legales y de una manera que no infrinja los derechos de terceros, ni restrinja o inhiba el uso y disfrute del sitio por parte de terceros.
                    </p>
                    </div>

                    <div>
                    <h2>3. Propiedad intelectual</h2>
                    <p>
                        Todo el contenido de este sitio web, incluyendo pero no limitado a texto, gráficos, logotipos, imágenes y software, está protegido por derechos de autor y otros derechos de propiedad intelectual.
                    </p>
                    </div>

                    <div>
                    <h2>4. Limitación de responsabilidad</h2>
                    <p>
                        En la medida permitida por la ley, excluimos todas las garantías, condiciones u otros términos que puedan estar implícitos en estos términos de uso por ley.
                    </p>
                    </div>

                    <div>
                    <h2>5. Cambios en los términos</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Le recomendamos que revise esta página periódicamente para mantenerse informado de cualquier cambio.
                    </p>
                    </div>

                    <div>
                    <h2>6. Términos del Servicio</h2>
                    <ul className="list-disc list-inside">
                        <li>Debe ser estudiante de la institución.</li>
                        <li>Debe proporcionar algún dato que se le sea requerido, como su nombre o correo electrónico, etc. A menos que se pueda omitir.</li>
                        <li>Debe considerar que no siempre la información que devuelve el servicio es 100% efectiva.</li>
                        <li>Usted estudiante, es responsable del manejo y uso de información a través del servicio.</li>
                        <li>Usted docente, es responsable de difundir información válida y coherente.</li>
                    </ul>
                    </div>

                    <div>
                    <h2>7. Condiciones Generales</h2>
                    <ul className="list-disc list-inside">
                        <li>Su uso del Servicio es bajo su propio riesgo. El servicio se proporciona "tal cual" y "según disponibilidad".</li>
                        <li>El abuso textual o palabras groseras no están permitidas y se considera una penalización.</li>
                        <li>No debe cargar, publicar, alojar ni transmitir correos electrónicos, SMS o mensajes de "spam" no solicitados.</li>
                        <li>No debe transmitir ningún gusano o virus ni ningún código de naturaleza destructiva.</li>
                        <li>No puede utilizar AISAC para ningún propósito ilegal o no autorizado. No debe, en el uso del Servicio, violar ninguna ley en su jurisdicción (incluidas, entre otras, las leyes de derechos de autor o marcas comerciales).</li>
                        <li>AISAC no garantiza que cumplirá con sus requisitos específicos.</li>
                        <li>Usted se compromete a no reproducir, duplicar, copiar, vender, revender o explotar ninguna parte del Servicio, el uso del Servicio o el acceso al Servicio sin el permiso expreso por escrito del creador de AISAC.</li>
                        <li>No puede subir documentos o imágenes que tengan contenido pornográfico, violencia, discriminación, racismo, política y comercio de productos.</li>
                        <li>Los archivos que suba para mejorar el modelo de inteligencia artificial, serán revisados antes de su publicación.</li>
                        <li>Acepta que el Servicio utiliza Cookies.</li>
                    </ul>
                    </div>

                    <div>
                    <h2>8. Divisibilidad</h2>
                    <p>
                        Si alguna disposición del presente documento, o la aplicación de dicha disposición a cualquier persona o circunstancia, es declarada inválida por un tribunal o árbitro, el resto de los términos del presente documento, o la aplicación de dicha(s) disposición(es) a personas o circunstancias distintas de aquellas en las que se considera inválida, no se verán afectados por ello. Los términos restantes se interpretarán de manera coherente con los términos y objetivos establecidos en el presente documento para dar la mejor manera posible a la intención de las partes.
                    </p>
                    </div>

                    <div>
                    <h2>9. Modificaciones al Servicio</h2>
                    <p>
                        El creador de AISAC se reserva el derecho en cualquier momento y de vez en cuando de modificar o interrumpir, temporal o permanentemente, el Servicio (o cualquier parte del mismo) con o sin previo aviso.
                    </p>
                    <p>
                        El creador de AISAC no será responsable ante usted ni ante ningún tercero por cualquier modificación, suspensión o interrupción del Servicio.
                    </p>
                    </div>
                </CardContent>
            </Card>
            <footer className="mt-8 text-center text-sm text-gray-500">
                <p>© 2024 AISAC. Creado por Advanced Community. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}
