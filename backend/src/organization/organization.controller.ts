import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDto } from "./DTOs/createOrganization.dto";

@Controller("organization")
export class OrganizationController {

    constructor(private readonly organizationService: OrganizationService) {}

    @Post("/create")
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOrganization(@Body() createOrganization: CreateOrganizationDto): Promise<Boolean> {
        return this.organizationService.createOrganization(createOrganization)
    }
}