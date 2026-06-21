import prisma from '../src/prismaClient.js'

const TOTAL_DEVICES = 10000

async function generatePeakTestData() {
    const startTime = Date.now()
    
    console.log('=== GENERARE DATE TEST - SCENARIU PEAK (după 7 zile) ===')
    console.log(`Dispozitive: ${TOTAL_DEVICES}`)
    console.log('')
    console.log('Structura datelor:')
    console.log('- SensorReading: 12 înregistrări per dispozitiv (ultimele 60 minute)')
    console.log('- SensorReadingHourly: 24 înregistrări per dispozitiv (ultimele 24 ore)')
    console.log('- SensorReadingDaily: 7 înregistrări per dispozitiv (ultimele 7 zile)')
    console.log('')
    
    // 1. Creează dispozitivele dacă nu există
    console.log('Verificare dispozitive...')
    const existingDevices = await prisma.device.findMany({
        select: { deviceId: true }
    })
    
    const existingIds = new Set(existingDevices.map(d => d.deviceId))
    const devicesToCreate = []
    
    for (let i = 2; i <= TOTAL_DEVICES + 1; i++) {
        const deviceId = `TEST-${i.toString().padStart(5, '0')}`
        if (!existingIds.has(deviceId)) {
            devicesToCreate.push({ 
                deviceId,
                claimSecret: 'test-secret'
            })
        }
    }
    
    if (devicesToCreate.length > 0) {
        console.log(`Creare ${devicesToCreate.length} dispozitive...`)
        await prisma.device.createMany({
            data: devicesToCreate,
            skipDuplicates: true
        })
        console.log(`✅ ${devicesToCreate.length} dispozitive create`)
    } else {
        console.log('✅ Toate dispozitivele există deja')
    }
    
    // 2. Generează date pentru toate tabelele
    console.log('')
    console.log('Generare înregistrări...')
    
    const now = new Date()
    const baseTimestamp = new Date(Math.floor(now.getTime() / 300000) * 300000)
    
    // SensorReading: 12 înregistrări (ultimele 60 minute)
    const sensorReadings = []
    for (let i = 2; i <= TOTAL_DEVICES + 1; i++) {
        const deviceId = `TEST-${i.toString().padStart(5, '0')}`
        
        for (let j = 0; j < 12; j++) {
            const timestamp = new Date(baseTimestamp.getTime() - (11 - j) * 300000)
            
            sensorReadings.push({
                deviceId,
                timestamp,
                readingCount: 1,
                solarV: 12.5,
                solarA: 3.2,
                solarW: 40,
                gridV: 220,
                gridA: 1.5,
                gridW: 330,
                battV: 12.8,
                battA: 0.5,
                battW: 6.4,
                battTemp: 25,
                battSoc: 85,
                internalV: 5.0,
                internalA: 2.0,
                internalW: 10,
                externalV: 12.0,
                externalA: 1.0,
                externalW: 12,
                solarVMin: 12.0,
                solarVMax: 13.0,
                solarAMin: 3.0,
                solarAMax: 3.5,
                solarWMin: 36,
                solarWMax: 45,
                gridVMin: 218,
                gridVMax: 222,
                gridAMin: 1.4,
                gridAMax: 1.6,
                gridWMin: 310,
                gridWMax: 350,
                battVMin: 12.5,
                battVMax: 13.0,
                battAMin: 0.3,
                battAMax: 0.7,
                battWMin: 3.75,
                battWMax: 9.1,
                internalVMin: 4.9,
                internalVMax: 5.1,
                internalAMin: 1.9,
                internalAMax: 2.1,
                internalWMin: 9.31,
                internalWMax: 10.71,
                externalVMin: 11.8,
                externalVMax: 12.2,
                externalAMin: 0.9,
                externalAMax: 1.1,
                externalWMin: 10.62,
                externalWMax: 13.42,
                battState: 'charging',
                relay1: true,
                relay2: false,
                relay3: true,
                relay4: false
            })
        }
        
        if (i % 1000 === 0) {
            console.log(`Progres SensorReading: ${i}/${TOTAL_DEVICES} dispozitive`)
        }
    }
    
    console.log(`Inserare ${sensorReadings.length} înregistrări SensorReading...`)
    await prisma.sensorReading.createMany({
        data: sensorReadings,
        skipDuplicates: true
    })
    
    // SensorReadingHourly: 24 înregistrări (ultimele 24 ore)
    const hourlyReadings = []
    for (let i = 2; i <= TOTAL_DEVICES + 1; i++) {
        const deviceId = `TEST-${i.toString().padStart(5, '0')}`
        
        for (let j = 0; j < 24; j++) {
            const timestamp = new Date(baseTimestamp.getTime() - (23 - j) * 3600000)
            
            hourlyReadings.push({
                deviceId,
                timestamp,
                readingCount: 12,
                solarV: 12.5,
                solarA: 3.2,
                solarW: 40,
                gridV: 220,
                gridA: 1.5,
                gridW: 330,
                battV: 12.8,
                battA: 0.5,
                battW: 6.4,
                battTemp: 25,
                battSoc: 85,
                internalV: 5.0,
                internalA: 2.0,
                internalW: 10,
                externalV: 12.0,
                externalA: 1.0,
                externalW: 12,
                solarVMin: 12.0,
                solarVMax: 13.0,
                solarAMin: 3.0,
                solarAMax: 3.5,
                solarWMin: 36,
                solarWMax: 45,
                gridVMin: 218,
                gridVMax: 222,
                gridAMin: 1.4,
                gridAMax: 1.6,
                gridWMin: 310,
                gridWMax: 350,
                battVMin: 12.5,
                battVMax: 13.0,
                battAMin: 0.3,
                battAMax: 0.7,
                battWMin: 3.75,
                battWMax: 9.1,
                internalVMin: 4.9,
                internalVMax: 5.1,
                internalAMin: 1.9,
                internalAMax: 2.1,
                internalWMin: 9.31,
                internalWMax: 10.71,
                externalVMin: 11.8,
                externalVMax: 12.2,
                externalAMin: 0.9,
                externalAMax: 1.1,
                externalWMin: 10.62,
                externalWMax: 13.42,
                battState: 'charging',
                relay1: true,
                relay2: false,
                relay3: true,
                relay4: false
            })
        }
        
        if (i % 1000 === 0) {
            console.log(`Progres SensorReadingHourly: ${i}/${TOTAL_DEVICES} dispozitive`)
        }
    }
    
    console.log(`Inserare ${hourlyReadings.length} înregistrări SensorReadingHourly...`)
    await prisma.sensorReadingHourly.createMany({
        data: hourlyReadings,
        skipDuplicates: true
    })
    
    // SensorReadingDaily: 7 înregistrări (ultimele 7 zile)
    const dailyReadings = []
    for (let i = 2; i <= TOTAL_DEVICES + 1; i++) {
        const deviceId = `TEST-${i.toString().padStart(5, '0')}`
        
        for (let j = 0; j < 7; j++) {
            const timestamp = new Date(baseTimestamp.getTime() - (6 - j) * 86400000)
            
            dailyReadings.push({
                deviceId,
                timestamp,
                readingCount: 288,
                solarV: 12.5,
                solarA: 3.2,
                solarW: 40,
                gridV: 220,
                gridA: 1.5,
                gridW: 330,
                battV: 12.8,
                battA: 0.5,
                battW: 6.4,
                battTemp: 25,
                battSoc: 85,
                internalV: 5.0,
                internalA: 2.0,
                internalW: 10,
                externalV: 12.0,
                externalA: 1.0,
                externalW: 12,
                solarVMin: 12.0,
                solarVMax: 13.0,
                solarAMin: 3.0,
                solarAMax: 3.5,
                solarWMin: 36,
                solarWMax: 45,
                gridVMin: 218,
                gridVMax: 222,
                gridAMin: 1.4,
                gridAMax: 1.6,
                gridWMin: 310,
                gridWMax: 350,
                battVMin: 12.5,
                battVMax: 13.0,
                battAMin: 0.3,
                battAMax: 0.7,
                battWMin: 3.75,
                battWMax: 9.1,
                internalVMin: 4.9,
                internalVMax: 5.1,
                internalAMin: 1.9,
                internalAMax: 2.1,
                internalWMin: 9.31,
                internalWMax: 10.71,
                externalVMin: 11.8,
                externalVMax: 12.2,
                externalAMin: 0.9,
                externalAMax: 1.1,
                externalWMin: 10.62,
                externalWMax: 13.42,
                battState: 'charging',
                relay1: true,
                relay2: false,
                relay3: true,
                relay4: false
            })
        }
        
        if (i % 1000 === 0) {
            console.log(`Progres SensorReadingDaily: ${i}/${TOTAL_DEVICES} dispozitive`)
        }
    }
    
    console.log(`Inserare ${dailyReadings.length} înregistrări SensorReadingDaily...`)
    await prisma.sensorReadingDaily.createMany({
        data: dailyReadings,
        skipDuplicates: true
    })
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log('')
    console.log(`✅ Date generate cu succes în ${duration}s`)
    console.log('')
    console.log('Total înregistrări create:')
    console.log(`- SensorReading: ${sensorReadings.length}`)
    console.log(`- SensorReadingHourly: ${hourlyReadings.length}`)
    console.log(`- SensorReadingDaily: ${dailyReadings.length}`)
    console.log(`- Total: ${sensorReadings.length + hourlyReadings.length + dailyReadings.length}`)
    
    await prisma.$disconnect()
}

generatePeakTestData().catch(err => {
    console.error('Eroare:', err)
    process.exit(1)
})
