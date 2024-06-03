# Recall Visualizations Project

## Overview
This project visualizes recall data from various states in the United States. The data includes information on recall reasons, product details, and recall status. The visualization is created using the D3.js JavaScript library.

## Data Description
The data consists of the following attributes:
- **Country and State**: All recalls are from the United States, with various states such as FL, CA, OH, etc.
- **Cities and Addresses**: Recalls are reported from cities like Davie, FL, and Millbrae, CA, with specific street addresses.
- **Recall Reasons**: Recalls are due to contamination risks, labeling issues, and undeclared allergens.
- **Product Information**: Products involved include dietary supplements and food items like mooncakes.
- **Recall Status**: Recalls have different statuses, such as Ongoing and Terminated.

This data provides detailed information about recall incidents, including geographical location, reason for recall, product details, and the current status of each recall.

## Prerequisites
To run the visualization, you will need:
- A web browser with JavaScript enabled.
- A local or remote server to serve the HTML file (e.g., using Python's `SimpleHTTPServer`).

## Getting Started
1. Clone this repository to your local machine.
2. Ensure you have a local server set up. If not, you can run a simple server using Python:
   ```sh
   python -m http.server
