import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesServiceService } from '../../_services/likes-service.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent {
  member = input.required<Member>();
  likeService = inject(LikesServiceService);
  hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id)
  );
  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          //If it has already liked then remove from likeIds signal
          this.likeService.likeIds.update((ids) =>
            ids.filter((x) => x !== this.member().id)
          );

          //this update method update the paginated result and you can remove dislike member without page refresh
          this.likeService.paginatedResult.update((current) => {
            if (!current || !current.items) return current;

            return {
              ...current,
              items: current.items.filter(
                (member) => member.id !== this.member().id  //filter the disliked member 
              ),
            };
          });
        } else {
          //otherwise add the current memberId in existing likeids signal
          this.likeService.likeIds.update((ids) => [...ids, this.member().id]);
        }
      },
    });
  }
}
// computed is a function that derives a value reactively.(One type of signal)
// It will recalculate automatically when any of the values inside it change (likeIds() or member().id).
// It’s read-only, so you can't directly assign a value to hasLiked, but you can use it in templates or other logic.

//includes(...)--Checks whether the current member().id exists in the list of liked user IDs.

//Here current is containing PaginationResult<MemberDto> object It has items array  and pagination

