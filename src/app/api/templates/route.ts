import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

// GET - List all templates
export async function GET() {
  try {
    const files = await fs.readdir(TEMPLATES_DIR);
    const templates = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(TEMPLATES_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const template = JSON.parse(content);
        templates.push({
          id: file.replace('.json', ''),
          ...template
        });
      }
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array if directory doesn't exist yet
  }
}

// POST - Save a new template
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tasks } = body;

    if (!name || !tasks) {
      return NextResponse.json(
        { error: 'Name and tasks are required' },
        { status: 400 }
      );
    }

    // Create safe filename
    const filename = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.json';
    const filePath = path.join(TEMPLATES_DIR, filename);

    const template = {
      name,
      tasks,
      createdAt: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(template, null, 2));

    return NextResponse.json({ success: true, id: filename.replace('.json', '') });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}
