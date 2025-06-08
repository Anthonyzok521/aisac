"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, Clock } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  students: number
  lessons: number
  duration: string
  progress: number
  status: "active" | "draft" | "archived"
}

interface CoursesListProps {
  courses: Course[]
  onEditCourse?: (courseId: string) => void
}

export function CoursesList({ courses, onEditCourse }: CoursesListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <Badge
                variant="outline"
                className={
                  course.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : course.status === "draft"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                {course.status === "active" ? "Activo" : course.status === "draft" ? "Borrador" : "Archivado"}
              </Badge>
            </div>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{course.students}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{course.lessons} lecciones</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onEditCourse && onEditCourse(course.id)}>
              Editar curso
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
