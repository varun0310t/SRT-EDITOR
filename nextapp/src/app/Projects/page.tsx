'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Edit2, Trash2 } from 'lucide-react'

type Project = {
  id: number
  title: string
  videoFile: string
  subtitleFile: string
  lastEdited: string
  progress: number
  thumbnail: string
}

export default function VideoSubtitleProjects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Marketing Video 2023",
      videoFile: "marketing_2023.mp4",
      subtitleFile: "marketing_2023_en.srt",
      lastEdited: "2023-06-15",
      progress: 75,
      thumbnail: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 2,
      title: "Product Tutorial",
      videoFile: "product_tutorial_v1.mp4",
      subtitleFile: "product_tutorial_v1_en.srt",
      lastEdited: "2023-06-10",
      progress: 30,
      thumbnail: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 3,
      title: "Customer Testimonial",
      videoFile: "testimonial_john_doe.mp4",
      subtitleFile: "testimonial_john_doe_en.srt",
      lastEdited: "2023-06-05",
      progress: 100,
      thumbnail: "/placeholder.svg?height=200&width=300"
    }
  ])

  const handleNewProject = () => {
    console.log("Creating new project")
  }

  const handleEditProject = (id: number) => {
    console.log(`Editing project ${id}`)
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Video Projects</h1>
        <Button onClick={handleNewProject}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative w-full pt-[56.25%]">
                <Image
                  src={project.thumbnail}
                  alt={`Thumbnail for ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 pt-6">
              <CardTitle className="mb-2">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-1">Video: {project.videoFile}</p>
              <p className="text-sm text-muted-foreground mb-2">Subtitle: {project.subtitleFile}</p>
              <div className="flex items-center space-x-2 text-sm">
                <span>Progress:</span>
                <Progress value={project.progress} className="flex-grow" />
                <span>{project.progress}%</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <p className="text-sm text-muted-foreground">Last edited: {project.lastEdited}</p>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEditProject(project.id)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}