🎯 Ballistic Pendulum: Projectile Velocity Simulation

A professional full-stack physics simulation designed to calculate and visualize the velocity of a projectile using the Ballistic Pendulum method. This project features a robust Spring Boot backend and a high-fidelity web interface inspired by the classic macOS X Leopard (Aqua) aesthetic.

👥 Development Team

Radion Vakhromeev — Lead Developer / Physics Logic

Ruslan Giniyatov — Full-stack Engineer / UI Design

Organization: Irkutsk National Research Technical University (IRNITU)

Group: ISIb-25

🧪 Scientific Context

The ballistic pendulum is a fundamental physics experiment used to measure the velocity of a fast-moving projectile. When the projectile strikes the pendulum, momentum is conserved, and the kinetic energy is converted into potential energy as the pendulum rises.

Mathematical Model

The initial velocity is calculated using the following formula:

$$v_0 = \frac{m + M}{m} \sqrt{2gh}$$

Where:

$v_0$ — Initial velocity ($m/s$)

$m$ — Mass of the projectile ($kg$)

$M$ — Mass of the pendulum ($kg$)

$h$ — Maximum vertical displacement ($m$)

$g$ — Gravitational acceleration ($\approx 9.81 \, m/s^2$)

🚀 Key Features

Interactive Lab Stand: A vintage macOS X Leopard UI with "Brushed Metal" textures.

Real-time Physics: Calculations performed via a Java REST API.

Advanced Visuals:

Realistic muzzle flash and recoil simulation.

Damped Harmonic Oscillation: The pendulum swings and settles based on physical gravity logic.

Automatic Scaling: Converts grams and centimeters to SI units instantly.

🛠 Tech Stack

Backend

Java 17 & Spring Boot 3

REST API for stateless calculations

Frontend

Vanilla JavaScript (Web Animations API)

Modern CSS3 (Radial Gradients, Glassmorphism, Keyframes)

Responsive design for high-resolution displays

📦 Getting Started

Prerequisites

JDK 17 or higher

Maven 3.6+

Installation

Clone the repository:

git clone [https://github.com/your-username/ballistic-pendulum.git](https://github.com/your-username/ballistic-pendulum.git)
cd ballistic-pendulum


Run the application:

./mvnw spring-boot:run


Open the Simulation:
Navigate to http://localhost:8080 in your web browser.

📂 Project Structure

├── src/
│   ├── main/
│   │   ├── java/com/example/bulletvelocity/
│   │   │   ├── PhysicsController.java    # Physics engine & REST logic
│   │   │   └── Application.java          # Spring Boot entry point
│   │   └── resources/
│   │       └── static/
│   │           └── index.html            # Web Interface & Animations
└── pom.xml                               # Project dependencies


🛡 License

Educational project developed at IRNITU. All rights reserved.

<p align="center">
Made with ❤️ by ISIb-25 Developers
</p>
