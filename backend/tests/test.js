import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

function avg(arr, field) {
  if (!arr.length) return 0;
  return arr.reduce((s, r) => s + parseFloat(r[field] || 0), 0) / arr.length;
}

async function run() {
  const d = await p.device.findUnique({ where: { deviceId: "TEST-01" }, select: { deviceId: true } });
  if (!d) { console.log('No device'); await p.$disconnect(); return; }
  console.log('DeviceId:', d.deviceId);

  // 24h - last 288 rows from SensorReading
  const r24 = await p.sensorReading.findMany({ where: { deviceId: d.deviceId }, select: { solarW: true, gridW: true, internalW: true, externalW: true }, take: 288, orderBy: { timestamp: 'desc' } });
  const aS = avg(r24, 'solarW'), aG = avg(r24, 'gridW'), aI = avg(r24, 'internalW'), aE = avg(r24, 'externalW');
  console.log('\n=== 24h (last 288 rows) ===');
  console.log('Count:', r24.length);
  console.log('avgSolar:', aS.toFixed(3), '-> solarW:', (aS * 24).toFixed(2), 'Wh');
  console.log('avgGrid:', aG.toFixed(3), '-> gridW:', (aG * 24).toFixed(2), 'Wh');
  console.log('avgInt:', aI.toFixed(3), 'avgExt:', aE.toFixed(3), '-> consumedW:', ((aI + aE) * 24).toFixed(2), 'Wh');

  // 7d - last 2016 rows from SensorReading
  const r7 = await p.sensorReading.findMany({ where: { deviceId: d.deviceId }, select: { solarW: true, gridW: true, internalW: true, externalW: true }, take: 2016, orderBy: { timestamp: 'desc' } });
  const bS = avg(r7, 'solarW'), bG = avg(r7, 'gridW'), bI = avg(r7, 'internalW'), bE = avg(r7, 'externalW');
  console.log('\n=== 7d (last 2016 rows) ===');
  console.log('Count:', r7.length);
  console.log('avgSolar:', bS.toFixed(3), '-> solarW:', (bS * 168).toFixed(2), 'Wh');
  console.log('avgGrid:', bG.toFixed(3), '-> gridW:', (bG * 168).toFixed(2), 'Wh');
  console.log('avgInt:', bI.toFixed(3), 'avgExt:', bE.toFixed(3), '-> consumedW:', ((bI + bE) * 168).toFixed(2), 'Wh');

  // 30d - from SensorReadingHourly, last 720 rows
  const r30 = await p.sensorReadingHourly.findMany({ where: { deviceId: d.deviceId }, select: { solarW: true, gridW: true, internalW: true, externalW: true }, take: 720, orderBy: { timestamp: 'desc' } });
  const cS = avg(r30, 'solarW'), cG = avg(r30, 'gridW'), cI = avg(r30, 'internalW'), cE = avg(r30, 'externalW');
  console.log('\n=== 30d (last 720 hourly rows) ===');
  console.log('Count:', r30.length);
  console.log('avgSolar:', cS.toFixed(3), '-> solarW:', (cS * 720).toFixed(2), 'Wh');
  console.log('avgGrid:', cG.toFixed(3), '-> gridW:', (cG * 720).toFixed(2), 'Wh');
  console.log('avgInt:', cI.toFixed(3), 'avgExt:', cE.toFixed(3), '-> consumedW:', ((cI + cE) * 720).toFixed(2), 'Wh');

  // 1y - from SensorReadingDaily, last 365 rows
  const r1y = await p.sensorReadingDaily.findMany({ where: { deviceId: d.deviceId }, select: { solarW: true, gridW: true, internalW: true, externalW: true }, take: 365, orderBy: { timestamp: 'desc' } });
  const dS = avg(r1y, 'solarW'), dG = avg(r1y, 'gridW'), dI = avg(r1y, 'internalW'), dE = avg(r1y, 'externalW');
  console.log('\n=== 1y (last 365 daily rows) ===');
  console.log('Count:', r1y.length);
  console.log('avgSolar:', dS.toFixed(3), '-> solarW:', (dS * 8760).toFixed(2), 'Wh');
  console.log('avgGrid:', dG.toFixed(3), '-> gridW:', (dG * 8760).toFixed(2), 'Wh');
  console.log('avgInt:', dI.toFixed(3), 'avgExt:', dE.toFixed(3), '-> consumedW:', ((dI + dE) * 8760).toFixed(2), 'Wh');

  // all - from SensorReadingWeekly, all rows
  const rAll = await p.sensorReadingWeekly.findMany({ where: { deviceId: d.deviceId }, select: { solarW: true, gridW: true, internalW: true, externalW: true, timestamp: true }, orderBy: { timestamp: 'asc' } });
  console.log('\n=== all (all weekly rows) ===');
  console.log('Count:', rAll.length);
  if (rAll.length) {
    const firstTs = rAll[0].timestamp.getTime();
    const hours = (Date.now() - firstTs) / 3600000;
    const eS = avg(rAll, 'solarW'), eG = avg(rAll, 'gridW'), eI = avg(rAll, 'internalW'), eE = avg(rAll, 'externalW');
    console.log('Hours since first:', hours.toFixed(1));
    console.log('avgSolar:', eS.toFixed(3), '-> solarW:', (eS * hours).toFixed(2), 'Wh');
    console.log('avgGrid:', eG.toFixed(3), '-> gridW:', (eG * hours).toFixed(2), 'Wh');
    console.log('avgInt:', eI.toFixed(3), 'avgExt:', eE.toFixed(3), '-> consumedW:', ((eI + eE) * hours).toFixed(2), 'Wh');
  }

  await p.$disconnect();
}

run();