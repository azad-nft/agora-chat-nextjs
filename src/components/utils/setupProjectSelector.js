import projectSelector from "../projectselector.html?raw";

const setupProjectSelector = async () => {
  const html = projectSelector;
  document.getElementById("projectSelector").innerHTML = html;
};

export default setupProjectSelector;
