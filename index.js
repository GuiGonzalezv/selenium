
//  O estudo de caso que implementamos o uso do selenium foi o moodle do campus jacareí mais especificadamente a parte de login, utilizamos o Selenium Web Driver para realizar a aplicação e criamos um mockup de dados genericos com alguns dados verdadeiros no qual o nosso script irá executar, após a execução estar completa, fizemos um script de log, no qual mostra as informações pertinentes ao teste. 
const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require("fs")
const moment = require('moment')
const path = require('path')


const mockup = [
    {username: "jc3001342", password: "55053683Gui"},
    {username: "53323542827", password: "sadfjjadf"},
    {username: "jc300127x", password: "assdaadfjjadf"},
    {username: "89999107842", password: "12312$@#"},
    {username: "11040218890", password: "asdasas"},
    {username: "69462970831", password: "!@#!@#"},
    {username: "95431053833", password: "asdaads"},
    {username: "97740198811", password: "123123ds"},
    {username: "07179701831", password: "çççççççç"},
    {username: "90544191803", password: "1234555"},
    {username: "20056227884", password: "massmd,"}
]

async function LoginMoodle(username, password) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navigate to Url
        await driver.get('https://moodle.jcr.ifsp.edu.br/');

        //Maximiza Tela
        await driver.manage().window().maximize()

        //Clica para entrar com suap
        await driver.findElement(By.css('.potentialidp>a')).sendKeys(Key.ENTER);

        //Credenciais Suap
        await driver.findElement(By.id('id_username')).sendKeys(username);
        await driver.findElement(By.id('id_password')).sendKeys(password);
        
        //Aperta o botão de Login
        await driver.findElement(By.css('.submit-row>input')).sendKeys(Key.ENTER);

        //Usa um elemento da pagina home para verificar se renderizou
        let referenceHomePage = await driver.wait(until.elementLocated(By.css('.header-button-title')),10000);

        //Verifica se renderizou a pagina de sucesso
        if(await referenceHomePage.getText() == "Mensagem"){
            //salva log da utilização
            saveLog('SUCCESS', username, password)
        }else{
            saveLog('ERROR', username, password)
        }
    }
    catch(e){
        saveLog('ERROR', username, password)
    }
    finally{
        // driver.quit();
    }
}

async function saveLog(status, user ,pass){
    let folder = path.normalize('./logs')
    let logfile = path.normalize('./logs/' + 'log-' + moment().format("YYYY-MM-DD") + '.txt')
    let content =  moment().format('DD-MM-YYYY') + ' ' + moment().format("HH:MM:SS") + ' LOGIN [' + status + ']' + ' Username: ' + user + ' Senha: ' + pass + '\r\n'
    if(!fs.existsSync(folder)){
        await mkdirp(folder)
    }

    if(!fs.existsSync(logfile)){
        await fs.writeFileSync(logfile, content)
    }else{
        fs.appendFileSync(logfile, content)
    }
}

function mkdirp(dir) {
    if (fs.existsSync(dir)) { return true }
    const dirname = path.dirname(dir)
    mkdirp(dirname);
    fs.mkdirSync(dir);
}

async function initializeTest(){
    for (test of mockup) {
        try{
            LoginMoodle(test.username, test.password)
        }catch(e){
            console.log(e)
        }
    }
}


initializeTest()