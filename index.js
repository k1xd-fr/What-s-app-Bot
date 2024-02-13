const puppeteer = require('puppeteer')
const XLSX = require('xlsx')
console.log('working')

const msg = ` Дорогие клиенты ADES CARGO- (код U) - мы поменяли адрес- просим вас поменять ОБЯЗАТЕЛЬНО ‼️‼️‼️‼️‼️ у себя в приложении адрес. 

♻️ВАШ ПЕРСОНАЛЬНЫЙ КОД ОСТАЁТСЯ- меняем только адрес- отправим видео для правильного заполнения

1. 厦U-ваш код
2. 15147091119
3. 广东省广州市白云区江高镇
4. 南岗三元南路62号安托仓储1119- 厦U-ваш код库房

📦 В случае заказа товара на старый склад- мы ответственность нести не будем

⚠️Во избежание таких ситуаций- просим сегодня же поменять адрес - пока не забыли‼️‼️

🌷И отправьте нам на проверку
На номер: 
➡️0705905055
➡️0225905055
➡️0997905055
Что бы посмотреть - как правильно заполнить- открой видео: 
«Прикрепить ссылку на видео»
❤️ С/У ADES CARGO

ЭТО БОТ РАССЫЛКА- СЮДА НИЧЕГО НЕ ОТПРАВЛЯЙТЕ`
async function main() {
	console.log('Начало работы программы')

	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto('https://web.whatsapp.com/')

	const workbook = XLSX.readFile('./phone.xlsx')
	const sheetName = workbook.SheetNames[0]
	const worksheet = workbook.Sheets[sheetName]

	const phoneColumnName = 'Phone'

	const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
	const phoneColumnIndex = data[0].indexOf(phoneColumnName)
	const phoneNumbers = data.slice(1).map((row) => row[phoneColumnIndex])

	console.log('Номера из файла:', phoneNumbers)
	const formattedPhoneNumbers = phoneNumbers.map((phone) => {
		const countryCode = phone.slice(0, 4)
		const remainingDigits = phone.slice(4)

		const formattedNumber = remainingDigits.replace(
			/(\d{3})(\d{3})(\d{3})/,
			'$1 $2 $3'
		)

		return `${countryCode} ${formattedNumber}`
	})
	console.log(formattedPhoneNumbers)
	const failedPhoneNumbers = []

	for (let i = 0; i < formattedPhoneNumbers.length; i++) {
		const phoneNumber = formattedPhoneNumbers[i]

		try {
			const newChatButton = await page.waitForSelector(
				'[data-icon="new-chat-outline"]'
			)
			await newChatButton.click()
			await page.type('.lexical-rich-text-input', `${phoneNumber}`)
			await new Promise((resolve) => setTimeout(resolve, 500))
			await page.waitForSelector(`span[title="${phoneNumber}"]`)
			await page.click(`span[title="${phoneNumber}"]`)
			await new Promise((resolve) => setTimeout(resolve, 500))
			await page.waitForSelector('._3Uu1_')
			await page.focus('._3Uu1_')
			await page.keyboard.down('Shift')

			await page.keyboard.type(msg)
			await page.keyboard.up('Shift')

			await new Promise((resolve) => setTimeout(resolve, 1200))
			await page.keyboard.press('Enter')
			console.log(`Сообщение для ${phoneNumber} успешно отправлено.`)
			await page.waitForSelector('.kiiy14zj')
			await page.click('.kiiy14zj')
			await page.waitForSelector('[aria-label="Удалить чат"]')
			await page.click('[aria-label="Удалить чат"]')
			await page.waitForSelector(
				'.emrlamx0.aiput80m.h1a80dm5.sta02ykp.g0rxnol2.l7jjieqr.hnx8ox4h.f8jlpxt4.l1l4so3b.le5p0ye3.m2gb0jvt.rfxpxord.gwd8mfxi.mnh9o63b.qmy7ya1v.dcuuyf4k.swfxs4et.bgr8sfoe.a6r886iw.fx1ldmn8.orxa12fk.bkifpc9x.rpz5dbxo.bn27j4ou.oixtjehm.hjo1mxmu.snayiamo.szmswy5k'
			)
			await page.click(
				'.emrlamx0.aiput80m.h1a80dm5.sta02ykp.g0rxnol2.l7jjieqr.hnx8ox4h.f8jlpxt4.l1l4so3b.le5p0ye3.m2gb0jvt.rfxpxord.gwd8mfxi.mnh9o63b.qmy7ya1v.dcuuyf4k.swfxs4et.bgr8sfoe.a6r886iw.fx1ldmn8.orxa12fk.bkifpc9x.rpz5dbxo.bn27j4ou.oixtjehm.hjo1mxmu.snayiamo.szmswy5k'
			)
			await new Promise((resolve) => setTimeout(resolve, 500))
		} catch (error) {
			console.error(
				`Ошибка при отправке сообщения на номер ${formattedPhoneNumbers}: ${error.message}`
			)
			failedPhoneNumbers.push(formattedPhoneNumbers)
		}
	}

	console.log('Не удалось отправить следующие номера:', failedPhoneNumbers)

	const workbookFailed = XLSX.utils.book_new()
	const worksheetFailed = XLSX.utils.aoa_to_sheet([
		['Номера, которые не удалось отправить'],
	])
	failedPhoneNumbers.forEach((phoneNumber, index) => {
		XLSX.utils.sheet_add_aoa(worksheetFailed, [[phoneNumber]], { origin: -1 })
	})
	XLSX.utils.book_append_sheet(
		workbookFailed,
		worksheetFailed,
		'Не отправленные номера'
	)
	XLSX.writeFile(workbookFailed, './failed_phone_numbers.xlsx')

	console.log('Работа программы завершена')
}
// const workbook = XLSX.readFile('./numbers.xlsx')
// const sheetName = workbook.SheetNames[0]
// const worksheet = workbook.Sheets[sheetName]

// const phoneColumnName = 'Phone'

// const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

// const phoneColumnIndex = data[0].indexOf(phoneColumnName)

main()
