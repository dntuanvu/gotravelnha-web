import { defineEventHandler, createError } from 'h3'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/docs
 * Returns OpenAPI/Swagger documentation in JSON format
 */
export default defineEventHandler(async (event) => {
  try {
    const openApiPath = join(process.cwd(), 'server/api/docs/openapi.json')
    const openApiContent = await readFile(openApiPath, 'utf-8')
    const openApiSpec = JSON.parse(openApiContent)
    
    // Update server URL based on current request
    const protocol = event.node.req.headers['x-forwarded-proto'] || 
                    (event.node.req.headers['x-forwarded-ssl'] === 'on' ? 'https' : 'http') ||
                    'http'
    const host = event.node.req.headers.host || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    
    openApiSpec.servers = [
      {
        url: baseUrl,
        description: 'Current server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://gotravelnha.com',
        description: 'Production server'
      }
    ]
    
    setResponseHeader(event, 'Content-Type', 'application/json')
    return openApiSpec
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Failed to load API documentation: ' + error.message
    })
  }
})
