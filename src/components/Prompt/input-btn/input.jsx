//Input Prompt

const Input = () => {
    return (
        //Textarea | Multiline
        <textarea aria-multiline maxLength="1000" className="transition-all duration-300 ease focus:h-20 hover:rounded-none rounded-lg outline-none p-2 w-full h-10" name="prompt" type="text" placeholder="Escribe tu pregunta aqui">
        </textarea>
    )
}

export default Input;