import { useState, useEffect } from "react";

interface Team {
    _id: string;
    name: string;
}

interface Project {
    _id: string;
    name: string;
}

export default function TeamProjectManager() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newTeam, setNewTeam] = useState<string>("");
    const [newProject, setNewProject] = useState<string>("");

    useEffect(() => {
        fetchTeams();
        fetchProjects();
    }, []);

    const fetchTeams = async () => {
        const res = await fetch("/api/teams");
        const data: Team[] = await res.json();
        setTeams(data);
    };

    const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        const data: Project[] = await res.json();
        setProjects(data);
    };

    const addTeam = async () => {
        if (!newTeam) return;
        await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newTeam })
        });
        setNewTeam("");
        fetchTeams();
    };

    const deleteTeam = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this team?")) {
            await fetch(`/api/teams/${id}`, { method: "DELETE" });
            fetchTeams();
        }
    };

    const addProject = async () => {
        if (!newProject) return;
        await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newProject })
        });
        setNewProject("");
        fetchProjects();
    };

    const deleteProject = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
            fetchProjects();
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Manage Teams & Projects</h2>
            
            <div className="mt-4">
                <h3 className="font-semibold">Teams</h3>
                <input
                    type="text"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    placeholder="New team name"
                    className="border p-2"
                />
                <button onClick={addTeam} className="ml-2 bg-blue-500 text-white px-4 py-2">Add</button>
                <ul>
                    {teams.map((team) => (
                        <li key={team._id} className="flex justify-between">
                            {team.name}
                            <button onClick={() => deleteTeam(team._id)} className="text-red-500">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">Projects</h3>
                <input
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="New project name"
                    className="border p-2"
                />
                <button onClick={addProject} className="ml-2 bg-green-500 text-white px-4 py-2">Add</button>
                <ul>
                    {projects.map((project) => (
                        <li key={project._id} className="flex justify-between">
                            {project.name}
                            <button onClick={() => deleteProject(project._id)} className="text-red-500">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
