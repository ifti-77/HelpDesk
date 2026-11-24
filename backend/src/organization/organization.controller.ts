import { Body, Controller, Post } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDto } from "./DTOs/createOrganization.dto";

@Controller("organization")
export class OrganizationController {

    constructor(private readonly organizationService: OrganizationService) {}

    @Post("/create")
    createOrganization(@Body() createOrganization: CreateOrganizationDto) {
        return this.organizationService.createOrganization(createOrganization)
    }
}