class ThingTypesController < ApplicationController
  before_action :set_thing_type, only: [:show, :update, :destroy]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  wrap_parameters :thing_type, include: ["name"]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  def index
    authorize ThingType
    thing_types = policy_scope(ThingType.all)
    @thing_types = ThingTypePolicy.merge(thing_types)
  end

  def show
    authorize @thing_type
    thing_types = ThingTypePolicy::Scope.new(current_user,
                                    ThingType.where(:id=>@thing_type.id))
                                    .user_roles(false)
    @thing_type = ThingTypePolicy.merge(thing_types).first
  end

  def create
    authorize ThingType
    @thing_type = ThingType.new(thing_type_params)

    ThingType.transaction do
      if @thing_type.save
        role=current_user.add_role(Role::ORGANIZER,@thing_type)
        @thing_type.user_roles << role.role_name
        role.save!
        render :show, status: :created, location: @thing_type
      else
        render json: {errors:@thing_type.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def update
    authorize @thing_type

    if @thing_type.update(thing_type_params)
      head :no_content
    else
      render json: {errors:@thing_type.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @thing_type
    @thing_type.destroy

    head :no_content
  end

  private

    def set_thing_type
      @thing_type = ThingType.find(params[:id])
    end

    def thing_type_params
      params.require(:thing_type).tap {|p|
          p.require(:name) #throws ActionController::ParameterMissing
        }.permit(:name)
    end
end
