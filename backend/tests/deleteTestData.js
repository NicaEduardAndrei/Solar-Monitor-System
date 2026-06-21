import prisma from '../src/prismaClient.js'

async function deleteTestData() {
    console.log('Șterg date pentru toate dispozitivele de test (TEST-01 - TEST-10001)...')
    
    // Șterge din toate tabelele de readings
    const readings = await prisma.sensorReading.deleteMany({
        where: {
            deviceId: {
                startsWith: 'TEST-'
            }
        }
    })
    console.log(`✅ SensorReading: ${readings.count} înregistrări șterse`)
    
    const hourly = await prisma.sensorReadingHourly.deleteMany({
        where: {
            deviceId: {
                startsWith: 'TEST-'
            }
        }
    })
    console.log(`✅ SensorReadingHourly: ${hourly.count} înregistrări șterse`)
    
    const daily = await prisma.sensorReadingDaily.deleteMany({
        where: {
            deviceId: {
                startsWith: 'TEST-'
            }
        }
    })
    console.log(`✅ SensorReadingDaily: ${daily.count} înregistrări șterse`)
    
    const weekly = await prisma.sensorReadingWeekly.deleteMany({
        where: {
            deviceId: {
                startsWith: 'TEST-'
            }
        }
    })
    console.log(`✅ SensorReadingWeekly: ${weekly.count} înregistrări șterse`)
    
    // Șterge dispozitivele de test
    const devices = await prisma.device.deleteMany({
        where: {
            deviceId: {
                startsWith: 'TEST-'
            }
        }
    })
    console.log(`✅ Device: ${devices.count} dispozitive șterse`)
    
    console.log('\n✅ Toate datele de test au fost șterse cu succes')
    await prisma.$disconnect()
}

deleteTestData().catch(console.error)
