#[derive(Debug, serde::Serialize)]
pub struct StringRing {
    x: i32,
    y: i32,
    radius: i32,
    pegcount: i32,
    input_image: Vec<Vec<f64>>,
    drawn_image: Vec<Vec<f64>>,
    width: i32,
    pixelcover: f64,
    pixelweights: Vec<Vec<f64>>,
    pegpos_img: Vec<(i32, i32)>,
    pegindex: i32,
    lastpegindex: i32,
    pegpairs: std::collections::HashSet<(i32, i32)>,
}
impl StringRing {
    pub fn new() -> Self {
        StringRing {
            x: 0,
            y: 0,
            radius: 0,
            pegcount: 0,
            input_image: Vec::new(),
            drawn_image: Vec::new(),
            width: 0,
            pixelcover: 0.0,
            pixelweights: Vec::new(),
            pegpos_img: Vec::new(),
            pegindex: 0,
            lastpegindex: 0,
            pegpairs: std::collections::HashSet::new(),
        }
    }
    pub fn set_parameters(
        &mut self,
        x: i32,
        y: i32,
        radius: i32,
        pegcount: i32,
        image: Vec<Vec<f64>>,
        pixelcover: f64,
    ) {
        self.x = x;
        self.y = y;
        self.radius = radius;
        self.pegcount = pegcount;
        self.input_image = image;
        self.drawn_image = vec![vec![1.0; self.input_image[0].len()]; self.input_image.len()];
        self.width = self.input_image[0].len() as i32;
        self.pixelcover = pixelcover;

        //initialize pixelweights as 1-(self.input_image)/255
        self.pixelweights = self
            .input_image
            .iter()
            .map(|row| {
                row.iter()
                    .map(|&value| 1.0 - value / 255.0)
                    .collect::<Vec<f64>>()
            })
            .collect::<Vec<Vec<f64>>>();
        self.pegpos_img = Vec::new();
        for i in 0..self.pegcount {
            let sz = self.width as f64 / 2.0;
            let (px, py) = circlepoint(sz, sz, sz, i, self.pegcount);
            self.pegpos_img.push((px, py));
        }
    }
    pub fn update(&mut self) -> i32 {
        self.pegindex += 1;
        self.pegindex
    }
    /// returns true if the point is in self.pegpairs
    fn haspair(&self, i: i32, j: i32) -> bool {
        if j < i {
            return self.pegpairs.contains(&(j, i));
        }
        self.pegpairs.contains(&(i, j))
    }
    /// inserts the pair (i,j) into self.pegpairs
    fn insertpair(&mut self, i: i32, j: i32) {
        if j < i {
            self.pegpairs.insert((j, i));
        } else {
            self.pegpairs.insert((i, j));
        }
    }
}
///
///converts a string of space seperated values in range 0-255 to a 2d array of floats
///
pub fn str_to_image(data: &str, width: i32, height: i32) -> Vec<Vec<f64>> {
    assert_eq!(width, height);
    let image_values = data.split(" ");
    let mut image = vec![vec![0.0; width as usize]; height as usize];
    for (i, value) in image_values.enumerate() {
        image[i / width as usize][i % width as usize] = value.parse().unwrap();
    }
    image
}
fn bresenham(x1: i32, y1: i32, x2: i32, y2: i32) -> Vec<(i32, i32)> {
    let mut points = Vec::new();

    let mut diffx = x2 - x1;
    let mut diffy = y2 - y1;

    if diffx == 0 && diffy == 0 {
        return points;
    }

    diffx += if diffx < 0 { -1 } else { 1 };
    diffy += if diffy < 0 { -1 } else { 1 };

    let inc: f64;
    let length: f64;
    let mut axis = 0;
    if diffx.abs() > diffy.abs() {
        length = diffx.abs() as f64;
        inc = diffy as f64 / length;
    } else {
        length = diffy.abs() as f64;
        inc = diffx as f64 / length;
        axis = 1;
    }

    let mut x = x1;
    let mut y = y1;
    let mut err = 0.0;
    for _ in 0..length as i32 {
        points.push((x, y));
        if axis == 0 {
            if diffx > 0 {
                x += 1;
            } else {
                x -= 1;
            }
            err += inc;
            if err >= 1.0 {
                err -= 1.0;
                y += 1;
            } else if err <= -1.0 {
                err += 1.0;
                y -= 1;
            }
        } else {
            if diffy > 0 {
                y += 1;
            } else {
                y -= 1;
            }
            err += inc;
            if err >= 1.0 {
                err -= 1.0;
                x += 1;
            } else if err <= -1.0 {
                err += 1.0;
                x -= 1;
            }
        }
    }
    points
}
fn circlepoint(x: f64, y: f64, r: f64, i: i32, n: i32) -> (i32, i32) {
    let angle = 2.0 * std::f64::consts::PI * i as f64 / n as f64;
    (
        (x + r * angle.cos()).floor() as i32,
        (y + r * angle.sin()).floor() as i32,
    )
}

#[allow(dead_code)]
fn circlerange(i: i32, j: i32, n: i32) -> Vec<i32> {
    let mut result = Vec::new();
    if i < j {
        for x in i..j {
            result.push(x);
        }
    } else {
        for x in i..n {
            result.push(x);
        }
        for x in 0..j {
            result.push(x);
        }
    }
    result
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bresenham() {
        let mut result = bresenham(0, 0, 3, 3);
        assert_eq!(result, vec![(0, 0), (1, 1), (2, 2), (3, 3)]);
        result = bresenham(0, 1, 3, 4);
        assert_eq!(result, vec![(0, 1), (1, 2), (2, 3), (3, 4)]);
        result = bresenham(0, 0, 0, 0);
        assert_eq!(result, vec![]);
    }
    #[test]
    fn test_bresenham_2() {
        let result = bresenham(0, 1, 3, 10);
        assert_eq!(
            result,
            vec![
                (0, 1),
                (0, 2),
                (0, 3),
                (1, 4),
                (1, 5),
                (2, 6),
                (2, 7),
                (2, 8),
                (3, 9),
                (3, 10)
            ]
        );
    }
    #[test]
    fn test_circlepoint() {
        let result = circlepoint(0.0, 0.0, 0.0, 0, 1);
        assert_eq!(result, (0, 0));
        let result = circlepoint(0.0, 0.0, 1.0, 1, 4);
        assert_eq!(result, (0, 1));
        let result = circlepoint(0.0, 0.0, 1.0, 2, 4);
        assert_eq!(result, (-1, 0));
        let result = circlepoint(20.0, 20.0, 1.0, 3, 4);
        assert_eq!(result, (20, 19));
    }
    #[test]
    fn test_str_to_image() {
        let result = str_to_image("0 1 2 3 4 5 6 7 8", 3, 3);
        assert_eq!(
            result,
            vec![
                vec![0.0, 1.0, 2.0],
                vec![3.0, 4.0, 5.0],
                vec![6.0, 7.0, 8.0]
            ]
        );
    }
    #[test]
    #[should_panic]
    fn test_str_to_image_panic() {
        str_to_image("0 1 2 3 4 5", 2, 3);
    }
}
