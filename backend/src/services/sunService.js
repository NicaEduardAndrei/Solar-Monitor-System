import * as Astronomy from "astronomy-engine";

export function getSunPosition(lat, lon, date = new Date()) {
    const observer = new Astronomy.Observer(lat, lon, 0);

    const equ = Astronomy.Equator("Sun", date, observer, true, true);
    const hor = Astronomy.Horizon(date, observer, equ.ra, equ.dec, "normal");

    return {
        azimuth: hor.azimuth,
        altitude: hor.altitude
    };
}