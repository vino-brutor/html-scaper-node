const fs = require("fs")
const path = require('path')
const readline = require('readline')

function scapeHtmlSpecialCharacter(text){
    return text.replace(/[<>&]/g, (match) => {
        switch(match){
            case '<': return '&lt;'
            case '>': return '&gt;'
            case '&': return '&amp;'
            case '"': return '&quot;'
            default: return match
        }
    })
}

function scapeHtmlFile(inputFilepath, outputPath){
    try{
        const fileContent = fs.readFileSync(inputFilepath, 'utf8')
        const scapedContent = scapeHtmlSpecialCharacter(fileContent)
        fs.writeFileSync(outputPath, scapedContent, 'utf8')
        console.log("Arquivo escapado com sucesso!")
    }catch(err){
        console.error(err.message)
        process.exit(1)
    }
}

function askFilepath(question){
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer)
            rl.close()
        })
    })
}

async function userInteraction(){
    let inputPath = process.argv[2]
    if(!inputPath){
        inputPath = await askFilepath("Informe o caminho do arquivo de entrada: ")
    }
    inputPath = path.resolve(inputPath)

    const defaultName = `escaped_${path.basename(inputPath)}.txt`
    const answer = await askFilepath(`Informe o caminho do arquivo de saída (padrão ${defaultName})`)
    let outputPath = answer.length > 0 ? answer : defaultName
    outputPath = path.resolve(outputPath) 

    scapeHtmlFile(inputPath, outputPath)
}


function run() {
    if(process.argv.length >= 4){
        scapeHtmlFile(path.resolve(process.argv[2]), path.resolve(process.argv[2]))
    }else {
        console.log("---------------------")
        console.log("HTML Tag Escaper v1.0")
        console.log("---------------------\n")
        console.log("Argumentos não informados! Por favor, informe os caminhos dos arquivos para realizar o escape.")
        userInteraction()
      }
}

run()