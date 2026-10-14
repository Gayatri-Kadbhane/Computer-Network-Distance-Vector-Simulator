# 🌐 Computer Network Distance Vector Simulator

### An Interactive Web-Based Routing Simulation

🔗 **Live Demo:** https://gayatri-kadbhane.github.io/Computer-Network-Distance-Vector-Simulator/

---

## 📌 Project Overview

The **Computer Network Distance Vector Simulator** is a web-based application developed to demonstrate the working of the Distance Vector Routing algorithm in computer networks.

The application allows users to create routers, establish connections between them, assign link costs, and find the minimum-cost route between a source router and a destination router.

It provides a visual and interactive way to understand routing tables, route calculation, and the exchange of routing information between neighboring routers.

## 🎯 Objectives

- Understand the Distance Vector Routing algorithm.
- Create a network with multiple routers.
- Configure connections and their associated costs.
- Find the minimum-cost path between two routers.
- Understand routing tables and route updates.
- Visualize network topology and routing results.

## ✨ Features

- **Custom Routers:** Create routers using custom names.
- **Network Connections:** Connect routers using links.
- **Configurable Link Costs:** Assign different costs to connections.
- **Source and Destination Selection:** Choose the starting and destination routers.
- **Best Route Calculation:** Determine the minimum-cost path.
- **Routing Table Visualization:** Understand routing information.
- **Interactive Network:** Experiment with different network topologies.
- **Visual Learning:** Explore routing concepts through a graphical interface.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Git and GitHub
- GitHub Pages

## 🧠 Distance Vector Routing Algorithm

Distance Vector Routing is a dynamic routing technique in which routers exchange information about the distances to destinations with their neighboring routers.

Each router maintains information about the minimum known distance to each destination and the next hop used to reach it.

The algorithm uses the following equation:

**Dₓ(y) = minᵥ [c(x,v) + Dᵥ(y)]**

Where:

- **Dₓ(y):** Minimum known distance from router x to destination y.
- **c(x,v):** Cost of the link between router x and neighboring router v.
- **Dᵥ(y):** Distance from neighbor v to destination y.

Routers repeatedly update their routing information until the routing tables converge.

## ⚙️ How to Use the Simulator

1. Open the live application.
2. Create routers with your preferred names.
3. Add connections between the routers.
4. Assign a cost to each connection.
5. Select the source router.
6. Select the destination router.
7. Run the routing simulation.
8. Observe the calculated route and its total cost.

## 🧪 Example Network

Consider the following network connections:

| Connection | Cost |
|---|---:|
| A — B | 2 |
| A — C | 7 |
| B — C | 3 |
| B — D | 5 |
| C — D | 1 |

### Finding the Best Route from A to D

**Route 1:** A → B → D

Total Cost = 2 + 5 = 7

**Route 2:** A → C → D

Total Cost = 7 + 1 = 8

**Route 3:** A → B → C → D

Total Cost = 2 + 3 + 1 = 6

### Result

- **Source Router:** A
- **Destination Router:** D
- **Best Route:** A → B → C → D
- **Minimum Total Cost:** 6

The route through routers B and C has the lowest total cost.

## 🏗️ Application Workflow

```text
        Start
          |
          v
   Create Routers
          |
          v
   Add Network Links
          |
          v
   Assign Link Costs
          |
          v
 Select Source and Destination
          |
          v
 Initialize Routing Tables
          |
          v
 Exchange Routing Information
          |
          v
    Update Route Costs
          |
          v
  Check for Convergence
          |
          v
  Calculate Best Route
          |
          v
 Display Route and Total Cost
          |
          v
         End
```

## 🚀 Deployment

This project is hosted using **GitHub Pages**.

🌍 **Live Application:**

https://gayatri-kadbhane.github.io/Computer-Network-Distance-Vector-Simulator/

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Gayatri-Kadbhane/Computer-Network-Distance-Vector-Simulator.git
   ```

2. Open the project folder:

   ```bash
   cd Computer-Network-Distance-Vector-Simulator
   ```

3. Open `index.html` in your web browser.

No backend server is required if the application uses only HTML, CSS, and JavaScript.

## 🔮 Future Enhancements

- Support for larger and more complex network topologies.
- Visualization of routing-table updates step by step.
- Simulation of router and link failures.
- Automatic route recalculation after network changes.
- Improved network visualization and animation.
- Additional demonstrations of routing protocols such as RIP.

## 🎓 Learning Outcomes

This project helps students understand:

- Basic computer networking concepts.
- Routing algorithms and path costs.
- Minimum-cost route calculation.
- Routing tables and next-hop selection.
- The process of routing-table convergence.
- Practical implementation of networking concepts in a web application.

## 👩‍💻 Author

**Gayatri Kadbhane**

Computer Engineering  
Sanjivani College of Engineering, Kopargaon

## 📄 License

This project is intended for educational and academic purposes.

---

⭐ If you find this project useful, consider giving the repository a star!

🔗 **Live Demo:** https://gayatri-kadbhane.github.io/Computer-Network-Distance-Vector-Simulator/
